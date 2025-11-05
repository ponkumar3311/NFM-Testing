pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // No sudo needed if already installed manually
                sh 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test growthstage.spec.js  --project=chromium  --reporter=html'
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
        }
    }
}
