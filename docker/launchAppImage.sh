#!/bin/sh

# Default resource allocation.  Port 3000 is mapped through as that's where 
# our Loopback application is configured to bind.
docker run -p 3000:3000 -p 27017:27017 -d questiny:wins-web

# Lean and mean variant
# docker run -p 3000:3000 -d questiny:wins-web --noprealloc --smallfiles

# To check out log files
# docker logs questiny:wins-web

# To open the command line console
# mongo --port 27017
