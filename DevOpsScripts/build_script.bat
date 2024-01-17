@echo off

set build_number=%1
docker build --tag nodejs:%build_number% .