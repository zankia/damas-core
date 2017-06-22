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