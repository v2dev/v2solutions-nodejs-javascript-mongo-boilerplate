pipeline{
    agent any
    options {
        skipDefaultCheckout(true)
    }

    environment {
        SONARQUBE_CREDENTIALS = credentials('sonar-cred')
        SONARQUBE_SERVER = 'sonarconfig'
        NODEJS_VERSION = '14' // Adjust the Node.js version as needed
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

        // stage("build-nodejs"){
        //     steps{
        //         script{
        //             sh 'npm install'
        //             sh 'npm run build'
        //         }
        //     }
        // }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.login=${SONARQUBE_CREDENTIALS}"
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