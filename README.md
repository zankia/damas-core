# damas-core ![Licence](https://img.shields.io/github/license/remyla/damas-core) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/remyla/damas-core) ![Docker Pulls](https://img.shields.io/docker/pulls/primcode/damas-core) ![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/primcode/damas-core)
```
     _
  __| | __ _ _ __ ___   __ _ ___        ___ ___  _ __ ___
 / _` |/ _` | '_ ` _ \ / _` / __|_____ / __/ _ \| '__/ _ \
| (_| | (_| | | | | | | (_| \__ \_____| (_| (_) | | |  __/
 \__,_|\__,_|_| |_| |_|\__,_|___/      \___\___/|_|  \___|
```
JSON storage using NodeJS focused on reliability, efficiency and extensibility.

Its main features are:
* RESTful HTTP web service
* CRUD operations based on [strict specifications](https://github.com/remyla/damas-core/wiki/4-Specifications)
* [JSON web token authentication](https://github.com/remyla/damas-core/wiki/Authentication)
* [Server extensions](https://github.com/remyla/damas-core/wiki/Extensions)
* [Python and Javascript API](https://github.com/remyla/damas-core/wiki/3-API-reference)
* [Command line interface](https://github.com/remyla/damas-core/blob/master/cli/README.md)

Directory structure:
```
├── cli/            client (Bash + curl)
├── docker/         package for deployment
├── js/             client (Javascript API)
├── py/             client (Python API)
├── server-nodejs/  server HTTP (NodeJS/Express)
├── server-tests/   server Jasmine unit tests
├── LICENSE         GNU GPLv3 license
└── README.md       this file
```

## Usage
Clone this repository and run:
```
cd docker
docker-compose up
```
In a web browser, open:
```
http://localhost
```

You can also run the server from the sources (without docker):
```
cd server-nodejs
node .
```

Read the [wiki](https://github.com/remyla/damas-core/wiki) to configure your server for your needs.

## Demo
Visit the demo server at https://demo.damas.io

## Related Links
http://damas-software.org is a website which presents the projects related to damas-core  
https://syncplanet.io is a Saas using damas-core as backend  
http://dabox.io is collaborative platform for architecture using damas-core as backend  
https://github.com/PRIMCODE/damas-flow is a flow graph interface  
https://github.com/PRIMCODE/damas-dashboard is a web control center and admin intreface, usable but not well packaged and documented yet. Get in touch if interested  
http://primcode.com PRIMCODE is the company behind the development, the distribution and the maintenance of damas-core

## Contributors
Remy Lalanne - Project lead  
Thibault Allard  
Julie Aresu  
Aymeric Cadier
Sebastien Courtois  
Ghislain Dugat  
Joaquin Galvan Angeles  
Stephane Hoarau  
Matthieu Humeau  
Mathieu Lalanne  
François Morlet  
Axel Pisani  
Axel Prat  
Mathieu Valero  
Quentin Villecroze

## License
GPL License(GPLV3)

Copyright(c) 2024 Remy Lalanne remy@primcode.com

damas-core is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

damas-core is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with damas-core.  If not, see <http://www.gnu.org/licenses/>.
