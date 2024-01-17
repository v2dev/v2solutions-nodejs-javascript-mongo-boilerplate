@echo off

set build_number=%1

docker tag v2devops/v2solutions-nodejs-boilerplate/nodejs:%build_number%
docker push v2devops/v2solutions-nodejs-boilerplate:nodejs:%build_number%