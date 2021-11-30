:information_source: This page explains how to install a new server. If you need to connect to an existing server, you can directly go to [[2 Connect]].

## Using Docker
* Copy [docker-compose.yml](https://raw.githubusercontent.com/remyla/damas-core/master/docker-compose.yml) and [conf.json](http://damas-software.org/docker/conf.json) to a local directory
* Run:

```shell
docker-compose up
```
Add `-d` argument (detach) to the command above to keep the servers running after closing the console. To stop the server and remove the containers:
```shell
docker-compose down
docker-compose rm
```

To install docker and docker-compose you could follow [the official tutorial](https://docs.docker.com/compose/install).

## Using NodeJS
* Clone the repository, and change directory to server-nodejs/
* Duplicate the template configuration file, install the packages, and run:
```sh
cp conf_install.json conf.json
npm install
node .
```
More parameters
```sh
# run debug mode
DEBUG=* node .

# the server listens to port 8090 by default. You can specify different ports and debug options
DEBUG=* HTTP_PORT=8091 HTTPS_PORT=8444 node .

# on windows:
set DEBUG=* & node .
```

## Configure
The server reads its configuration from `server-nodejs/conf.json`. You can edit it according to your needs:

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

### Enable User Authentication
Please see [JWT extension](https://github.com/remyla/damas-core/wiki/Extensions#jwt)


## Test the installation
You could use a web browser to connect to the service:
```
http://localhost
```
Or after an installation using NodeJS
```
http://localhost:8090
```

##  Next steps
Now that you have a running server you can read [[2 Connect]] to setup a Python, JavaScript or Shell client environment, and read [[3 API Reference]].

In case you encounter some difficulties during the installation process you could create an issue describing the problem in this repository and we will try to solve it.