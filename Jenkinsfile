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

        // // SonarQube Scan Stage
        // stage('SonarQube Scan') {
        //     steps {
        //         script {
        //             def scannerHome = tool 'SonarQubeScanner'
        //             def projectKey = "Nodejs"
        //             withSonarQubeEnv(SONARQUBE_SERVER) {
        //                 echo "Current working directory: ${pwd()}"
        //                 bat "./sonarqube_script.bat ${scannerHome} ${projectKey}"
        //             }
        //         }
        //     }   
        // }

        // // Quality Gate Stage
        // stage('Quality Gate') {
        //     steps {
        //         script {
        //             withSonarQubeEnv(SONARQUBE_SERVER) {
        //                 def qg = waitForQualityGate()
        //                 if (qg.status != 'OK') {
        //                     error "Quality Gate failed: ${qg.status}"
        //                 }
        //                 else {
        //                     echo "Quality Gate Success"
        //                 }
        //             }
        //         }
        //     }
        // }

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

        // Helm Chart Stage
        stage("Helm Chart") {
            steps {
                script {
                    dir("node-js-app-chart") {
                        // Run commands to create the Helm chart (e.g., helm package)
                        bat 'echo "Creating package"'
                        bat 'helm package .'
                        // Get the generated chart file name
                        // def chartFileName = bat(script: 'ls -1 | grep \'.tgz\'', returnStdout: true).trim()
                        // Rename the chart file to a unique name
                        // bat "mv $chartFileName nodejs-helm-chart.tgz"
                    }
                }
            }
        }

        // Push Helm Chart to Docker Hub
        stage("Push Helm Chart to Docker Hub") {
            steps {
                script {
                    dir("node-js-app-chart") {
                        withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){
                            // Push the Helm chart to Docker Hub
                            sh "helm push nodejs-helm-chart.tgz  oci://registry-1.docker.io/v2devops"
                            // echo "helm chart push successful"
                        }
                    }
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