#!/bin/sh

containerId=`docker build app_container | awk '{ print $3 }'`
docker --tag $containerId wins/web-app
