pipeline {
  agent any

  parameters {
    string(name: 'AWS_ACCOUNT_ID', description: 'AWS Account ID')
  }

  environment {
    AWS_REGION     = 'us-east-1'
    AWS_ACCOUNT_ID = "${params.AWS_ACCOUNT_ID}"

    BACKEND_IMAGE  = 'fullstack-backend'
    FRONTEND_IMAGE = 'fullstack-frontend'

    ECR_BACKEND    = "${params.AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/fullstack-automation-backend"
    ECR_FRONTEND   = "${params.AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/fullstack-automation-frontend"

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
    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
      dir('infra') {
        sh 'terraform init'
      }
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
    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
      dir('infra') {
        sh 'terraform plan -no-color'
      }
    }
  }
}

    stage('Check ECR Repos') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
          sh 'aws ecr describe-repositories --region ${AWS_REGION}'
        }
      }
    }

    stage('ECR Login') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
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
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
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
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
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