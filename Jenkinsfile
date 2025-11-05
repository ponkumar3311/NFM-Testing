pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/I4u-Labs/nurseryautomation.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests headless (default in CI)
                sh 'npx playwright test --reporter=html'
            }
        }

        stage('Archive Test Report') {
            steps {
                // Ensure report directory exists
                script {
                    if (!fileExists('playwright-report')) {
                        error("Playwright report directory not found. Test execution may have failed.")
                    }
                }
            }
        }
    }

    post {
        always {
            // Publish Playwright HTML Report in Jenkins UI
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
        }
    }
}
