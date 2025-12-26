#!/bin/bash

# docker rmi $(docker ps --filter "name=falcontodo-sys" --format "{{.ID}}")
docker build -t falcontodo-sys .
docker run -it --rm --memory=4G falcontodo-sys

# EOF
