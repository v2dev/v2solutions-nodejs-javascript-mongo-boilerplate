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

        // SonarQube Scan Stage
        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    def projectKey = "Nodejs"
                    withSonarQubeEnv(SONARQUBE_SERVER) {
                        echo "Current working directory: ${pwd()}"
                        bat "./sonarqube_script.bat ${scannerHome} ${projectKey}"

                        // Manually construct the SonarQube Analysis URL
                        def sonarqubeUrl = "${SONARQUBE_SERVER}/dashboard?id=${projectKey}"
                        echo "SonarQube Analysis URL: ${sonarqubeUrl}"

                        // Set the URL as an environment variable to use it in later stages
                        env.SONARQUBE_URL = sonarqubeUrl
                    }
                }
            }   
        }

        // Email Notification Stage
        // stage('Email Notification') {
        //     steps {
        //         script {
        //             // Check if the SONARQUBE_URL environment variable is set
        //             if (env.SONARQUBE_URL) {
        //                 // Compose the email body with the manually constructed SonarQube Analysis URL
        //                 def emailBody = "SonarQube Analysis URL: ${env.SONARQUBE_URL}"

        //                 // Send email using the emailext plugin
        //                 emailext body: emailBody,
        //                         subject: 'SonarQube Analysis Report',
        //                         to: 'sagar.thorat@v2solutions.com',
        //                         mimeType: 'text/html'
        //             } else {
        //                 error "SonarQube Analysis URL is not available. Make sure the previous stage executed successfully."
        //             }
        //         }
        //     }
        // }

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

        // Helm Chart Stage
        stage("Helm Chart") {
            steps {
                script {
                    // Update Helm chart values.yaml with the build number
                    updateHelmChartValues(env.BUILD_NUMBER)
                    dir("node-js-app-chart") {
                        // Run commands to create the Helm chart (e.g., helm package)
                        bat '@echo off'
                        bat 'echo "Creating package"'
                        bat 'helm package .'
                        // Capture the name of the Helm chart package
                        helmPackageName = bat(script: 'dir /B *.tgz', returnStdout: true).trim()
                        // Print the package name for verification
                        echo "Helm chart package name: ${helmPackageName}"
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
                            echo "Helm chart package name:-------- ${helmPackageName}"
                            bat "helm push node-js-app-chart-0.1.0.tgz  oci://registry-1.docker.io/v2devops"
                            // echo "helm chart push successful"
                        }
                    }
                }
            }
        }
    }
}

def updateHelmChartValues(buildNumber) {
    // Read values.yaml file
    def valuesYamlPath = "node-js-app-chart/values.yaml"
    def valuesYamlContent = readFile(file: valuesYamlPath).trim()

    // Update image tag with the build number
    valuesYamlContent = valuesYamlContent.replaceAll(/tag: latest/, "tag: ${buildNumber}")

    // Write updated values.yaml file
    writeFile(file: valuesYamlPath, text: valuesYamlContent)
}