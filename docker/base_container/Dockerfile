# DockerFile for Dev/Testing Tier Docker Container
FROM ubuntu:14.04
MAINTAINER John Heinnickel <john@questinygroup.com>

# Update apt-get.  Install sudo, curl, wget, Java JRE, PostgreSQL, and PostGIS.
RUN apt-get update 
RUN apt-get install -y sudo curl wget default-jre postgresql postgis

# Create a no-password questiny account with sudo to own the foregroup shell.
RUN adduser --home /home/questiny --disabled-password --gecos '' questiny
RUN adduser questiny sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Ubuntu is still packaging NodeJS 0.10.20.  Use Nodesource's repository instead
# for NodeJS 0.12.0 instead.  Too bad there's no brew here.
# RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
# 
# For the latest NodeJS 0.10.x, replace the first line of this block with:
RUN curl -sL https://deb.nodesource.com/setup_0.10 | sudo bash -
RUN apt-get update && apt-get install -y nodejs
 
# Consider enabling the following to experiment with iojs 1.4.x as the forked
# alternative to NodeJS 0.12.0.
RUN curl -sL https://deb.nodesource.com/setup_iojs_1.x | sudo bash - 
RUN apt-get update && apt-get install -y iojs

# To avoid getting a stale MongoDB from Ubuntu's archive, we'll install from
# MongoDB's own official archive.
RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/10gen.list
RUN apt-get update && apt-get install -y mongodb-org

# Alternately, replace above line with one like the following to select a
# specific version of MongoDB from the official depot.
# RUN apt-get update && apt-get install -y mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1

# Allocate a data directory for MongoDB.  Expose its default port (27017), and
# set mongodb as a dockerized entry point application.
RUN mkdir -p /data/db
EXPOSE 27017
ENTRYPOINT /usr/bin/mongod

# TODO: Are the apt-get PostGIS, PostgreSQL, and NodeJS binaries adequate?
 
# Use npm to install Loopback
RUN npm install -g strongloop

# LoopBack App Base Image
# Installs StrongLoop and Git
# FROM dockerfile/nodejs
 
# Install Git (new than apt package?)
RUN mkdir /data/git-tmp
WORKDIR /data/git-tmp
RUN apt-get install -y build-essential libssl-dev libcurl4-gnutls-dev libexpat1-dev gettext unzip
RUN     wget https://github.com/git/git/archive/v1.9.4.tar.gz && \
        zcat v1.9.4.tar.gz | tar xf -
RUN     cd git-1.9.4 && \
        make prefix=/usr/local all && \
        sudo make prefix=/usr/local install
RUN     cd ~ && rm /data/git-tmp -Rvf
 
# Setup Git
RUN git config --global user.name "Questiny Docker Container" && \
                git config --global user.email "dev@questinygroup.com"
 
CMD ["/bin/bash", "--login"]

