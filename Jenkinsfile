pipeline {
    agent {
        docker {
            image 'node:10-alpine' 
            args '-p 4000:4000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
    }
}