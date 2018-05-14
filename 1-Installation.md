## Using Docker
Download [docker-compose.yml](http://damas-software.org/docker/docker-compose.yml) and [conf.json](http://damas-software.org/docker/conf.json) and copy them into a local directory.

```shell
docker-compose up
```
Your TTY will be attached with all server logs. So if you send SIGINT (ctrl+C) it will close the servers. In order to keep them running, you need to add `-d` argument (detach) to the command above.

To stop the server and remove the containers:
```shell
docker-compose down
docker-compose rm
```

To install docker and docker-compose you could follow [this tutorial](https://docs.docker.com/compose/install).

The images are hosted on Docker Hub [zankia/damas-node](https://hub.docker.com/r/zankia/damas-node) (the 3 tags correspond to github branches).

## Installation without Docker

Clone the repository, and change directory to server-nodejs/.  
Duplicate the template configuration file, install the packages, and run:
```sh
cp conf_install.json conf.json
npm install
nodejs .
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
The configuration of the core server is located at JSON root, whereas the optional code is organized as extensions. Extensions are disabled by default or can be disabled using the `"enable": false` key switch.

* `https`: SSL certificate to use
* `db`: which Database Management System to use. Available: `debug`, `mongodb`
* `mongodb`: Mongo database options Keep the default values to use a mongodb located on the same machine
* `fileSystem`: the path to the root directory where files are indexed from
* `extensions`: modules to provide extensions to the core

## Run
In the server-nodejs/ folder:
```sh
node .
```
Debug mode:
```
DEBUG=app:* node .
```
On windows:
```
set DEBUG=app:* & node .
```
The server listens to port 8090 by default. You can specify different ports and debug options:
```
DEBUG=* HTTP_PORT=8091 HTTPS_PORT=8444 nodejs .
```
Then open http://localhost:8090/api in a web browser to access the server located on the same machine

## Create SSL certificate
By default the SSL is disabled in the configuration template.
```json
"https" : { 
    "enable": false,
    "cert": "cert.pem",
    "key": "key.pem"
}
```  
To enable SSL specify `"enable: true"` and the SSL certificate files tu use (usually `key.pem` and `cert.pem`) in conf.json.

### Generate a certificate

#### Letsencrypt  
If you need to generate a certificate, you can use certbot with the following command to generates keys in /etc/letsencrypt/config-dir/live/ :
```shell
docker run --name certbot -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot certonly -q --standalone --agree-tos -m YOUR@EMAIL.COM -d YOUR_DOMAIN_NAME
```

#### Self Signed  
In case you need to quickly create a self signed SSL certificate in order to use https you may find this line useful
```sh
openssl req -new -x509 -days 9999 -nodes -out cert.pem -keyout key.pem
```

##  Next steps

In case you encounter difficulties during the installation process you could create an issue describing the problem in this repository and we will try to resolve it.

Now that you have a running server you can read the other pages to setup a client environment (Python, JavaScript, or Command-line)