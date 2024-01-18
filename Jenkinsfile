pipeline{
    agent any
    options {
        skipDefaultCheckout(true)
    }

    environment {
        SONARQUBE_CREDENTIALS = credentials('sonar-cred')
        SONARQUBE_SERVER = 'sonarconfig'
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

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.login=${SONARQUBE_CREDENTIALS}"
                        bat "${scannerHome}/bin/sonar-scanner.bat -D\"sonar.projectKey=Nodejs\" -D\"sonar.sources=.\" -D\"sonar.host.url=${SONARQUBE_SERVER}\" -D\"sonar.token=sqp_6ac7d7c4a9b56c5730f784c5e61d54d085679401\""
                    }
                }
            }
        }

        stage("build"){
            // when {
            //     expression {
            //         currentBuild.changeSets.any {
            //             it.branch == 'Chandrashekar_main' ||
            //             it.changeRequest && it.changeRequest.target.branch == 'Chandrashekar_main'
            //         }
            //     }
            // }
            steps{
                bat '@echo off'
                bat 'echo %WORKSPACE%'
                dir("DevOpsScripts") {
                    bat './build_script.bat %BUILD_NUMBER%'
                }
            }
        }
        stage("push"){
            // when {
            //     expression { currentBuild.changeSets.any { it.branch == 'Chandrashekar_main' } }
            // }
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