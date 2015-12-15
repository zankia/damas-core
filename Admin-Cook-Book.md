Don't forget to backup the database before doing mass changes. You can create a script for that purpose.

#### MongoDB dump script
```sh
#!/bin/sh
# Usage :
# - Edit this file to match the setup of the project
# - Copy this file to /etc/cron.hourly/
target="/path/to/db/backupdir"
mkdir -p $target
mongodump -o $target/mongodb_`/bin/date +%y%m%d-%H:%M`
```
You can copy this script to /etc/cron.hourly/mongodb-dump for an hourly automated backup.


#### Convert keys to integers in a MongoDB shell
We want to force the time keys to be integers instead of strings:
```js
db.node.find().forEach(function(n){ if(typeof n.time === 'string') n.time = new NumberInt(n.time); db.node.save(n)})
```