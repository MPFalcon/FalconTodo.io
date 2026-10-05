pipeline {
    agent any

    stages {
        stage('Checkout GitHub Repo') {
            steps {
                // For a private repo, provide the exact Credentials ID stored in your Jenkins credentials store
                git branch: 'dev',
                    url: 'https://github.com/MPFalcon/FalconTodo.io.git'
            }
        }
        
        stage('Test Connectivity App') {
            steps {
                sh "echo 'Testing Connectivity'"
                sh "sudo docker compose down"
                sh "sudo docker network prune --force"
                sh "sudo docker system prune -a --volumes --force"
                sh "sudo docker compose up --wait"
                sh 'wget http://localhost:3000'
                sh "cat index.html"
            }
        }
        stage('Start Live') {
            steps {
                sh "echo 'Running Application'"
                sh "sudo docker compose up"
            }
        }
    }
}