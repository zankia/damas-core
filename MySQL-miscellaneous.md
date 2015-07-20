
### MySQL
Reverse every links in the database
```SQL
UPDATE link SET src_id=(@temp:=src_id), src_id = tgt_id, tgt_id = @temp;
```