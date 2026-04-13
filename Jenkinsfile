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

    stage('Backend Test') {
      steps {
        dir('backend') {
          sh 'npm test || true'
        }
      }
    }

    stage('Frontend Test') {
      steps {
        dir('frontend') {
          sh 'CI=true npm test -- --watchAll=false'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $BACKEND_IMAGE ./backend'
        sh 'docker build -t $FRONTEND_IMAGE ./frontend'
      }
    }

    stage('Terraform Init') {
      steps {
        dir('infra') {
          sh 'terraform init'
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

    // Later:
    // stage('Push to ECR') { ... }
    // stage('Deploy to ECS') { ... }
  }
}
