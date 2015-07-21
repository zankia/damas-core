# Developers
The Javascript and Python implementations are available in this repository under /js/damas.js and /py/damas.py
respectively.

## Getting Started
### Javascript
Include the library from a html document
```html
<script type="text/javascript" src="damas.js"></script>
```
or using requireJS
```js
require('damas.js');
```

### Python
Copy the provided damas.py module to your installation or to your current directory and import it

```python
# import the module
>>> import damas

# connect to your server
>>> project = damas.http_connection('http://xxx.xxx.xxx.xxx:8090')

# create a new node
>>> project.create({"key1":"value1","key2":"value2"});
[{u'key2': u'value2', u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'xxx.xxx.xxx.xxx'}]

# read the node
>>> project.read('55ae0b1ed81e88357d77d0e9')
[{u'key2': u'value2', u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'xxx.xxx.xxx.xxx'}]

```


### Web service
You can directly use the web service urls with curl for example.

Search every /production asset on the server
```
http://yourserver/search/file:/^production
```

#### Script examples from version 2.2
```js
// Javascript
// Parse the current node's children, retrieve the 'file' key from the first grand-child, and set it on the child
damas.current_node.children.each( function(n){
    var file = damas.children(n.id)[0].keys.get('file');
    damas.update(n.id, {file: file});
});
```
Please refer to the [[API documentation|API]].

## Administrators
[[MySQL Miscellaneous]]

### server-php installation
* apache2, mysql-server and php5 have to be installed.
* import damas_init.sql in a new database
* edit server/server.php to match your configuration
* add an Alias in Apache pointing to your repository

`Alias /damas/server      "/usr/share/damas-core/server/"`
