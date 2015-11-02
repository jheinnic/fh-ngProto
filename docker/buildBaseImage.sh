#!/bin/sh

# Option for bootstrapping from an image that already has NodeJS installed.
# docker pull dockerfile/nodejs

containerId=`docker build base_container | awk '{ print $3 }'`
docker --tag $containerId wins/web-app_base
