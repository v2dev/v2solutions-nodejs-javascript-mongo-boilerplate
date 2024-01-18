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