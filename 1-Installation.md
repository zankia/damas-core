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

## Using NodeJS
Clone the repository, and change directory to server-nodejs/.  
Duplicate the template configuration file, install the packages, and run:
```sh
cp conf_install.json conf.json
npm install
node .
```
More parameters
```sh
# debug mode
DEBUG=* node .

# the server listens to port 8090 by default. You can specify different ports and debug options
DEBUG=* HTTP_PORT=8091 HTTPS_PORT=8444 node .

# on windows:
set DEBUG=app:* & node .
```

## Configure
The server reads its configuration from `server-nodejs/conf.json`. Copy the default configuration file `server-nodejs/conf_install.json` to `server-nodejs/conf.json` and edit it according to your needs:

```json
{                                                                                                                     
    "authorMode" : true,
    "https" : { 
        "enable": false,
        "cert": "fullchain.pem",
        "key": "privkey.pem"
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
* `authorMode`: if enabled the users are able to edit their nodes
* `https`: specify a certificate and enable TLS
* `db`: which Database Management System to use. Available values: `debug`, `mongodb`
* `mongodb`: MongoDB options. Keep the default values to use a database located on the same machine
* `fileSystem`: path to the file repository root from which the files are indexed from
* `extensions`: modules list to extend the core. See the [[Extensions]] page for more details about the available extensions.

## Run
In a web browser, after the installation using Docker on the same machine, open
```
http://localhost
```
Or after an installation using NodeJS
```
http://localhost:8090
```


##  Next steps
Now that you have a running server you can read [[2 Getting Started]] to setup a Python, JavaScript or Shell client environment, and read [[3 API Reference]].

In case you encounter difficulties during the installation process you could create an issue describing the problem in this repository and we will try to resolve it.