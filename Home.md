# Installation
* apache2, mysql-server and php5 have to be installed.
* import damas_init.sql in a new database
* edit server/server.php to match your configuration
* add an Alias in Apache pointing to your repository

`Alias /damas/server      "/usr/share/damas-core/server/"`



## Server Queries Examples
Search every /production node:

    damas/server/model.json.php?cmd=search&keys={%22*%22:%22REGEXP%20%27^/production%27%22}