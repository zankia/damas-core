### Database dump and restore
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

#### MySQL dump script
```sh
#!/bin/sh
# Usage :
# - Edit this file to match the setup of the project
# - Copy this file to /etc/cron.hourly/
db_name=damasdb
db_user=damas
db_pass=XXXXXXXX
target="/path/to/db/backupdir"
mkdir -p $target
/usr/bin/mysqldump -u$db_user -p$db_pass $db_name | /bin/bzip2 > $target/${db_name}_`/bin/date +%y%m%d-%H:%M`.sql.bz2
```

### Database Queries Examples

#### MongoDB: list the 10 last modified files
> db.node.find({file:{$exists:true}}).sort({time:-1}).limit(10)

#### MongoDB: Update some file synchonization flags on PSD files
In a MongoDB shell, this will print all your files having the `.psd` file extension:
```js
db.node.find({file:/.*.psd/}).forEach(function(n){print(JSON.stringify(n))})
```
Update the files, for example removing some sync flags:
```js
db.node.update({file:/.*.psd/}, {$unset:{dmn_angouleme:1, pipangai:1, dream_wall:1}}, {multi:true})
```
> depending on MongoDB version you have different syntaxes and options available
https://docs.mongodb.org/manual/reference/method/db.collection.update/

#### MongoDB: Mass-change a key type
The protocol was changing some timestamps values from Integers to Strings during their transfer due to issue #91. We wanted to change their type back to Integers in the database:
```js
db.node.find({time:{$type:2}}).forEach(function(obj){obj.time = NumberInt(obj.time); db.node.save(obj) })
```
To view all `time` keys of String type:
```js
db.node.find({time: {$type: 2}});
```
#### MySQL: Invert graph edges direction
You may need to invert the direction of the edges. This was useful for us to migrate our data from the MySQL scheme in the 2.3 version before importing to the newer MongoDB scheme 
```SQL
UPDATE link SET src_id=(@temp:=src_id), src_id = tgt_id, tgt_id = @temp;
```

### Miscelaneous

#### Add every file of the repository recursively
In a shell with the damas command line interface:
```sh
find . -type f -exec damas add {} \;
```