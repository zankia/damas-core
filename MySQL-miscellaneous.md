
## MySQL Queries

### inverst link 
You may need to invert the direction of the declared links. This was useful for us to migrate our data from the MySQL scheme in the 2.3 version before importing to the newer MongoDB scheme 
```SQL
UPDATE link SET src_id=(@temp:=src_id), src_id = tgt_id, tgt_id = @temp;
```

## MySQL Administration

### Setup a hourly backup of the MySQL database
```sh
#!/bin/sh
# Usage :
# - Edit this file to match the setup of the project
# - Copy this file to /etc/cron.hourly/
db_name=damasdb
db_user=damas
db_pass=XXXXXXXX
target="/home/damas/damas_backups"
/usr/bin/mysqldump -u$db_user -p$db_pass $db_name | /bin/bzip2 > $target/${db_name}_`/bin/date +%y%m%d-%H:%M`.sql.bz2
```