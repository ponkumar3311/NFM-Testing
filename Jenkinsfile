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
                sh 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test growthstage.spec.js --project=chromium --reporter=html'
            }
        }
    }

    post {
        success {
            emailext(
                subject: "SUCCESS: Playwright Tests Passed on Jenkins",
                body: """<p>Hi Team,</p>
                         <p>The Playwright tests have <b>passed</b> successfully.</p>
                         <p><a href="${env.BUILD_URL}">View Build Details</a></p>""",
                to: "recipient@example.com",
                mimeType: 'text/html'
            )
        }

        failure {
            emailext(
                subject: "FAILURE: Playwright Tests Failed on Jenkins",
                body: """<p>Hi Team,</p>
                         <p>The Playwright test build <b>failed</b>.</p>
                         <p><a href="${env.BUILD_URL}">Click here to view console logs</a></p>
                         <p>Jenkins job: <b>${env.JOB_NAME}</b><br>
                         Build Number: <b>${env.BUILD_NUMBER}</b></p>""",
                to: "recipient@example.com",
                mimeType: 'text/html'
            )
        }

        always {
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
        }
    }
}
