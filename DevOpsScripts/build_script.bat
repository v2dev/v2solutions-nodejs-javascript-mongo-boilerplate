@echo off

set build_number=%1
@REM docker build --tag nodejs:%build_number%

docker build --tag dockerhubusername/dockerhubreponame:%build_number%