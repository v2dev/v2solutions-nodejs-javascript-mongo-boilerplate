pipeline{
    agent any
    options {
        skipDefaultCheckout(true)
    }

    // Setup Environment Variables
    environment {
        SONARQUBE_CREDENTIALS = credentials('sonar-cred')
        SONARQUBE_SERVER = 'sonarconfig'
        SCAN_TOKEN = credentials('nodejs-scan-token')
        EMAIL_TO = 'sagar.thorat@v2solutions.com'
    }

    stages{
        stage("Initialise"){
            steps{
                cleanWs()
            }
        }
        stage("git"){
            steps{
                git branch: 'Chandrashekar_main', url: 'https://github.com/v2dev/v2solutions-nodejs-boilerplate.git'
            }
        }

        // SonarQube Scan Stage
        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    def projectKey = "Nodejs"
                    withSonarQubeEnv(SONARQUBE_SERVER) {
                        echo "Current working directory: ${pwd()}"
                        bat "./sonarqube_script.bat ${scannerHome} ${projectKey}"
                    }
                }
            }   
        }

        // Quality Gate Stage
        stage('Quality Gate') {
            steps {
                script {
                    withSonarQubeEnv(SONARQUBE_SERVER) {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Quality Gate failed: ${qg.status}"
                        }
                        else {
                            echo "Quality Gate Success"
                        }
                    }
                }
            }
        }

        // Generate Scan Report
        stage('Generate Scan Report') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    def projectKey = "Nodejs"
                    withSonarQubeEnv(SONARQUBE_SERVER) {
                        bat "${scannerHome}/bin/sonar-scanner.bat -D\"sonar.projectKey=${projectKey}\" -D\"sonar.sources=.\" -D\"sonar.host.url=http://192.168.8.71:9000\" -D\"sonar.login=${SONARQUBE_CREDENTIALS}\" -D\"sonar.analysis.mode=preview\" -D\"sonar.issuesReport.html.enable=true\""
                    }
                }
            }
        }

        // Email Stage
        stage("Email Report") {
            steps {
                emailext subject: 'SonarQube Scan Report',
                          body: 'Please find the attached SonarQube Scan Report.',
                          to: EMAIL_TO,
                          attachmentsPattern: '**/target/sonar/report-task.txt'
            }
        }

        // Build Stage
        stage("build"){
            steps{
                bat '@echo off'
                bat 'echo %WORKSPACE%'
                dir("DevOpsScripts") {
                    bat './build_script.bat %BUILD_NUMBER%'
                }
            }
        }
        
        // Push Images to docker hub
        stage("push"){
            steps{
                withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){
                    bat '@echo off'
                    bat 'echo %WORKSPACE%'
                    dir("DevOpsScripts") {
                        bat './push_script.bat %BUILD_NUMBER%'
                    }
                }
            }
        }
    }
}