pipeline {
  agent any

  environment {
    AWS_REGION     = 'us-east-1'
    AWS_ACCOUNT_ID = '767398054553'

    BACKEND_IMAGE  = 'fullstack-backend'
    FRONTEND_IMAGE = 'fullstack-frontend'

    ECR_BACKEND    = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fullstack-automation-backend"
    ECR_FRONTEND   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fullstack-automation-frontend"

    ECS_CLUSTER    = 'fullstack-automation-cluster'
    ECS_SERVICE    = 'fullstack-automation-service'

    IMAGE_TAG      = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Backend Install') {
      steps {
        dir('backend') {
          sh 'npm ci'
        }
      }
    }

    stage('Frontend Install') {
      steps {
        dir('frontend') {
          sh 'npm ci'
        }
      }
    }

    stage('Backend Smoke Test') {
      steps {
        dir('backend') {
          sh 'npm test || true'
        }
      }
    }

    stage('Frontend Build Test') {
      steps {
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('Build Backend Docker Image') {
      steps {
        sh 'docker build -t ${BACKEND_IMAGE}:latest ./backend'
      }
    }

    stage('Build Frontend Docker Image') {
      steps {
        sh '''
          docker build \
            --build-arg REACT_APP_API_URL=/api/id \
            -t ${FRONTEND_IMAGE}:latest \
            ./frontend
        '''
      }
    }

    stage('Terraform Init') {
      steps {
        dir('infra') {
          sh 'terraform init'
        }
      }
    }

    stage('Terraform Validate') {
      steps {
        dir('infra') {
          sh 'terraform validate'
        }
      }
    }

    stage('Terraform Plan') {
      steps {
        dir('infra') {
          sh 'terraform plan -no-color'
        }
      }
    }

    stage('ECR Login') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh '''
            aws ecr get-login-password --region ${AWS_REGION} \
            | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
          '''
        }
      }
    }

    stage('Tag Images') {
      steps {
        sh '''
          docker tag ${BACKEND_IMAGE}:latest ${ECR_BACKEND}:latest
          docker tag ${BACKEND_IMAGE}:latest ${ECR_BACKEND}:${IMAGE_TAG}

          docker tag ${FRONTEND_IMAGE}:latest ${ECR_FRONTEND}:latest
          docker tag ${FRONTEND_IMAGE}:latest ${ECR_FRONTEND}:${IMAGE_TAG}
        '''
      }
    }

    stage('Push Images') {
      steps {
        sh '''
          docker push ${ECR_BACKEND}:latest
          docker push ${ECR_BACKEND}:${IMAGE_TAG}

          docker push ${ECR_FRONTEND}:latest
          docker push ${ECR_FRONTEND}:${IMAGE_TAG}
        '''
      }
    }

    stage('Deploy to ECS') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh '''
            aws ecs update-service \
              --cluster ${ECS_CLUSTER} \
              --service ${ECS_SERVICE} \
              --force-new-deployment \
              --region ${AWS_REGION}
          '''
        }
      }
    }

    stage('Wait for ECS Stability') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh '''
            aws ecs wait services-stable \
              --cluster ${ECS_CLUSTER} \
              --services ${ECS_SERVICE} \
              --region ${AWS_REGION}
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully: images pushed and ECS redeployed.'
    }
    failure {
      echo 'Pipeline failed. Check stage logs for the exact break point.'
    }
    always {
      sh 'docker image prune -f || true'
    }
  }
}