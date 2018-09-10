## Using Docker
Copy [docker-compose.yml](http://damas-software.org/docker/docker-compose.yml) and [conf.json](http://damas-software.org/docker/conf.json) to a local directory then run:

```shell
docker-compose up
```
Add `-d` argument (detach) to the command above to keep the servers running after closing the console.

To stop the server and remove the containers:
```shell
docker-compose down
docker-compose rm
```

To install docker and docker-compose you could follow [the official tutorial](https://docs.docker.com/compose/install).

The images are hosted on Docker Hub [zankia/damas-node](https://hub.docker.com/r/zankia/damas-node) (the 3 tags correspond to the git development branches).

## Installation without Docker

Clone the repository, and change directory to server-nodejs/.  
Duplicate the template configuration file, install the packages, and run:
```sh
cp conf_install.json conf.json
npm install
nodejs .
```
More parameters
```sh
# debug mode
DEBUG=app:* nodejs .

# the server listens to port 8090 by default. You can specify different ports and debug options
DEBUG=* HTTP_PORT=8091 HTTPS_PORT=8444 nodejs .

# on windows:
set DEBUG=app:* & node .
```

## Configure
The server reads its configuration from `server-nodejs/conf.json`. Copy the default configuration file `conf_install.json` to `conf.json` and edit it according to your needs:

```json
{                                                                                                                     
    "authorMode" : true,
    "https" : { 
        "enable": false,
        "cert": "cert.pem",
        "key": "key.pem"
    },  
    "db": "mongodb",
    "mongodb": {
        "host": "localhost",
        "collection": "node",
        "port": 27017,
        "options": { "auto_reconnect": true }
    },  
    "fileSystem": "/PRODUCTIONS/",
    "extensions": {
    }
}
```
The configuration is divided into sections:
* `https`: SSL certificate to use
* `db`: which Database Management System to use. Available: `debug`, `mongodb`
* `mongodb`: Mongo database options Keep the default values to use a mongodb located on the same machine
* `fileSystem`: the path to the root directory where files are indexed from
* `extensions`: modules to provide extensions to the core

## Run
Open http://localhost/api (docker) or http://localhost:8090/api (node) in a web browser to access the server located on the same machine

##  Next steps

In case you encounter difficulties during the installation process you could create an issue describing the problem in this repository and we will try to resolve it.

Now that you have a running server you can read the other pages to setup a client environment (Python, JavaScript, or Command-line)