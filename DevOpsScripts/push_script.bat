@echo off

set build_number=%1

docker tag nodejs:%build_number% v2devops/v2solutions-nodejs-boilerplate:%build_number%
docker push v2devops/v2solutions-nodejs-boilerplate:%build_number%