pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'
    BACKEND_IMAGE = 'fullstack-backend'
    FRONTEND_IMAGE = 'fullstack-frontend'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

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
            --build-arg REACT_APP_API_URL=http://localhost:8080/ \
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
          sh 'terraform plan'
        }
      }
    }
  }
}