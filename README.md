# Padevusplatvorm back-end API

## Technologies used

* [Golang](https://golang.org/)
* [Dep](https://github.com/golang/dep)
* [Gin HTTP web framework](https://gin-gonic.github.io/gin/)
* [Go MySQL Driver](https://github.com/go-sql-driver/mysql)
  * [Go database/sql tutorial](http://go-database-sql.org/index.html)
* [Docker & Docker compose](https://www.docker.com/)
* [MariaDB Docker](https://hub.docker.com/_/mariadb/)
* [Golang Docker](https://hub.docker.com/_/golang/)

## Quick guide

1. Install Golang
2. go get repository
3. Install docker & docker-compose
4. Use $docker-compose up
5. Import or create tables for database

## Install Golang

[Golang](https://golang.org/)

## Set up correct Go path

### OSX example

    It's best to add these lines to ~/.zshrc or ~/.bashrc (depending on what shell you use):
    export GOPATH=$HOME/go
    export GOROOT=/usr/local/opt/go/libexec
    export PATH=$PATH:$GOPATH/bin
    export PATH=$PATH:$GOROOT/bin

## Clone repository

    It`s best to use "go get" command:
    go get github.com/centre-for-educational-technology/Padevusplatvorm-be

    For help: go help get

## Install Docker Compose and it's Prerequisites

[Docker compose](https://docs.docker.com/compose/install/)

## Run with compose-up

    docker-compose up

## The API should be up and running

    http://localhost:8080/

## To run test files for project

    docker-compose run app go test -v ./...

## This will print our environment for inside of our container

    docker-compose run app go env

## Database

    Database is stored in ./data/db directory outside the docker container for simple backups.
    See docker-compose.yml
    mariadb:
        volumes:
            - ./data/db:/var/lib/mysql
