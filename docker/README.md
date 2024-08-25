# damas-core docker

This configuration can be used to start a server on the local machine using 3 containers:

* nginx       - the http front-end
* damas-core  - the http damas api
* mongo       - the database

Current directory structure:
```
├── db/             the mongo database storage containing the nodes
├── extensions/     your JS damas-core extensions that can be loaded at startup
├── www/            your files that can be served (http://localhost/file)
├── compose.yaml    start using `docker compose up`
├── damas.json      damas configuration
├── Dockerfile      image build instructions
├── nginx.conf      nginx configuration
└── README.md       this file
```

## RUN
1. From the current directory run the command:
```
docker compose up
```
It will open a web server listening to port 80.

2. Open a web browser (Firefox) on http://localhost

You will see the server home page. Follow the instructions to start communicating with it using the clients libraries.

## CONFIGURE
You can adapt this configuration to manage permissions on nodes, user authentication, make a public server, load a tls certificate for https, make a reverse proxy, etc. Please read the documentation for this or ask for some help on the support channels.

## BUILD
To build a new damas-core image from sources:
```
docker compose build
```


