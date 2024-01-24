@echo off
set SCANNER_HOME=%1
set PROJECT_KEY=%2
@REM %SCANNER_HOME%\bin\sonar-scanner -Dsonar.login=%SONARQUBE_CREDENTIALS% -Dsonar.projectKey=%PROJECT_KEY%
@REM %SCANNER_HOME%\bin\sonar-scanner.bat -D"sonar.projectKey=Nodejs" -D"sonar.sources=." -D"sonar.host.url=${SONARQUBE_SERVER}" -D"sonar.token=${SCAN_TOKEN}"
%SCANNER_HOME%\bin\sonar-scanner -D"sonar.projectKey=%PROJECT_KEY%" -D"sonar.sources=." -D"sonar.host.url=%SONARQUBE_SERVER%" -D"sonar.login=%SONARQUBE_CREDENTIALS%" -D"sonar.token=%SCAN_TOKEN%"