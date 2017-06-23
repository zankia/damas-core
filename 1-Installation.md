# Installation with docker
To get damas running, the easiest way is using docker

## Requirements
### Install docker and docker-compose
If you don't have it yet, you will need docker and docker-compose.

Please use [this tutorial](https://docs.docker.com/compose/install) to install them.

### Download preset files
You will also need our preset [config file](http://zankia.fr/damas/conf.json) and [docker-compose file](http://zankia.fr/damas/docker-compose.yml).

docker-compose.yml goes into your project root directory and conf.json goes into a `conf/` directory inside the project root.

### Create SSL certificate
Damas requires a SSL certificate to run. If you have one, please copy or link key.pem and cert.pem into `conf/`.

If you need to generate a certificate, you can use certbot with the following command to generates keys in /etc/letsencrypt/config-dir/live/ :
```shell
docker run --name certbot -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot certonly -q --standalone --agree-tos -m YOUR@EMAIL.COM -d YOUR_DOMAIN_NAME
```

If you don't want to use HTTPS, you can create fake files with `touch key.pem cert.pem`. Or you can remove `connection` part of the conf.json and it won't run the HTTPS server.

## Run
To get damas running, you need to know a single command :

```shell
docker-compose up
```

Your TTY will be attached with all server logs. So if you send SIGINT (ctrl+C) it will close the servers. In order to keep them running, you need to add `-d` argument to the command above.

## More information
For more information, please read [docker documentation](https://docs.docker.com) for both docker-ce and docker-compose which are really great.

Our main image is [zankia/damas-node](https://hub.docker.com/r/zankia/damas-node) (the 3 tags correspond to github branches).

## Troubleshooting

#### Error: Cannot find module './conf'
Your conf.json is not in the `conf/` directory.

#### Error: EISDIR: illegal operation on a directory, read
You don't have key.pem and cert.pem files in the `conf/` directory.

#### Are you trying to mount a directory onto a file (or vice-versa)?
You have run docker-compose up without the necessary files and trying to run it again with the good files. You need the remove the container first with `docker-compose rm`


# Installation without Docker

On a system with NodeJS, npm and mongoDB installed, in the server-nodejs/ folder, run:
```sh
npm install
```

Copy the default configuration file `conf_install.json` to `conf.json` and edit it according to your needs (see instructions below)

In case you need to quickly create a self signed SSL certificate in order to use https you may find this line useful
```sh
openssl req -new -x509 -days 9999 -nodes -out cert.pem -keyout key.pem
```

## Run
In the server-nodejs/ folder:
```
DEBUG=app:* node .
```
On windows:
```
set DEBUG=app:* & node .
```
The server will be listening and waiting for commands on ports 8090 and 8443 by default. You can specify different ports and debug options. This could be useful to run a server for tests:
```
DEBUG=* HTTP_PORT=8091 HTTPS_PORT=8444 nodejs .
```

# Configure
The server reads its configuration from the `server-nodejs/conf.json` file. Copy the default configuration file `conf_install.json` to `conf.json` and edit it according to your needs:

```js
{
    "authorMode" : true,
    "connection" : {
        "Cert": "cert.pem",
        "Key": "key.pem"
    },
    "db" : "mongodb",
    "mongodb": {
        "host": "localhost",
        "collection": "node",
        "port": 27017,
        "options": { "auto_reconnect": true }
    },
    "extensions": {
        "es6_polyfills": {
            "path": "./extensions/es6_polyfills.js"
        },
        "user_setup" : {
            "path" : "./extensions/user_setup.js",
            "conf": {
                "nodemailer_transporter":{
                    "host": "localhost",
                    "port": 25,
                    "secure": false
                },
                "nodemailer_from": "\"Sender\" <noreply@example.com>"
            }
        },
        "jwt": {
            "enable": false,
            "path": "./extensions/auth-jwt-node.js",
            "conf": {
                "required": false,
                "passwordHashAlgorithm": "sha1",
                "secret": "webtokensecret",
                "exp": 1440,
                "expressUse": "/api",
                "expressUnless": {
                    "path": "/api/signIn"
                }
            }
        },
        "noauth": {
            "enable": true,
            "path": "./extensions/auth-none.js"
        },
        "prefer_https": {
            "path": "./extensions/prefer_https.js"
        },
        "static_routes": {
            "path": "./extensions/static_routes.js",
            "conf": {
                "routes": {
                    "/": "public",
                    "/js": "../js",
                    "/cli": "../cli",
                    "/py": "../py",
                    "/api": "public/index.html"
                }
             }
        }
    },
    "fileSystem": "/PRODUCTIONS/"
}
```
The configuration of the core server is located at JSON root, whereas the optional code is organized as extensions. Extensions are disabled by default or can be disabled using the `"enable": false` key switch.

* `connection`: paths to the SSL certificate to use for https (see below to generate a self signed certificate)
* `db`: which Database Management System to use. Available: `debug`, `mongodb`
* `mongodb`: the options to connect to the database. Keep the default values to use a mongodb located on the same machine
* `fileSystem`: the path to the indexed files root directory to serve assets from

## Extensions
### jwt
JSON Web Token authentication
* `passwordHashAlgorithm`: `sha1` or `md5`
* `secret`:  encryption salt string
* `exp`: token expiration time in seconds

### static_routes
A list of relative or absolute paths to be served by the server. It contains server resources and possible HTML interfaces.