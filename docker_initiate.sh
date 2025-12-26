#!/bin/bash

# docker rmi $(docker ps --filter "name=falcontodo-sys" --format "{{.ID}}")
docker build -t falcontodo-sys .
docker run -it --rm falcontodo-sys

# EOF
