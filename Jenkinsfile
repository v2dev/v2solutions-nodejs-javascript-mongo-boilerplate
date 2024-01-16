pipeline{
    agent any
    options {
        skipDefaultCheckout(true)
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
        stage("build"){
            steps{
                bat '@echo off'
                bat 'echo %WORKSPACE%'
                dir("DevOpsScripts") {
                    bat './build_script.bat %BUILD_NUMBER%'
                }
            }
        }
        stage("login"){
            steps{
                bat '@echo off'
                bat 'echo %WORKSPACE%'
                dir("DevOpsScripts") {
                    bat './login_script.bat %DOCKER_USERNAME% %DOCKER_PASSWORD%'
                }
            }
        }
        stage("push"){
            steps{
                bat '@echo off'
                bat 'echo %WORKSPACE%'
                dir("DevOpsScripts") {
                    bat './push_script.bat'
                }
            }
        }
    }
}