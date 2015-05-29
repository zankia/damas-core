# Installation
* apache2, mysql-server and php5 have to be installed.
* import damas_init.sql in a new database
* edit server/server.php to match your configuration
* add an Alias in Apache pointing to your repository

`Alias /damas/server      "/usr/share/damas-core/server/"`



## Server Queries Examples
Search every /production node:

    damas/server/model.json.php?cmd=search&keys={%22*%22:%22REGEXP%20%27^/production%27%22}

## API Scripting Examples
Parse the current node's children, retrieve the 'file' key from the first grand-child, and set it on the child
```js
damas.current_node.children.each( function(n){
    var file = damas.children(n.id)[0].keys.get('file');
    damas.update(n.id, {file: file});
});
```

## Versions notes
You may need to invert the direction of the declared links. This was useful for us to migrate our data from the MySQL scheme in the 2.3 version before importing to the newer MongoDB scheme 
```SQL
UPDATE link SET src_id=(@temp:=src_id), src_id = tgt_id, tgt_id = @temp;
```