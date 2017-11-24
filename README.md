# Padevusplatvorm back-end API
## Technologies used:
* [Golang](https://golang.org/)
* [Govendor](https://github.com/kardianos/govendor)
* [Gin HTTP web framework](https://gin-gonic.github.io/gin/)
* [Go MySQL Driver](https://github.com/go-sql-driver/mysql)
    * [Go database/sql tutorial](http://go-database-sql.org/index.html)
* [Docker & Docker compose](https://www.docker.com/)
* [MariaDB Docker](https://hub.docker.com/_/mariadb/)
* [Golang Docker](https://hub.docker.com/_/golang/)

# For Development
## Install Golang
    [Golang](https://golang.org/)

## Set up correct Go path
### OSX example:
    It's best to add these lines to ~/.zshrc or ~/.bashrc (depending on what shell you use):
    export GOPATH=$HOME/go
    export GOROOT=/usr/local/opt/go/libexec
    export PATH=$PATH:$GOPATH/bin
    export PATH=$PATH:$GOROOT/bin

## Clone repository
    For this project docker-compose.yml is looking for ~/go/src/Padevusplatvorm-be
    So it is best to use the same GOPATH or change the volumes: in docker-compose.yml

    For example (SSH):
    $ cd ~/go; git clone git@github.com:centre-for-educational-technology/Padevusplatvorm-be.git

## Install Docker Compose and it's Prerequisites
[Docker compose](https://docs.docker.com/compose/install/)

## This will print our environment for inside of our container
    $ docker-compose run app go env

## Run with compose-up
    $ docker-compose up

## To run test files for project
    docker-compose run app go test -v ./...

## To vendor our project's dependencies [Govendor](https://github.com/kardianos/govendor)
### Only needed if you add external dependencies!
    $ go get -u github.com/kardianos/govendor
    Make sure you're in the correct project directory!
    $ govendor init
    $ govendor add +external

## After the vendor command we compose-up
    $ docker-compose up

## The API should be up and running
    http://localhost:8080/

## Docker network ip for mariadb
    docker network inspect padevusplatvormbe_app-tier

# Database
    Database is stored in ./data/db directory outside the docker container for simple backups. 
    See docker-compose.yml 
    mariadb:
        volumes: 
            - ./data/db:/var/lib/mysql