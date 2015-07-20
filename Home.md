## Developers
The Javascript and Python implementations are available in this repository under /js/damas.js and /py/damas.py
respectively.
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
Copy damas.py to your installation or to your current directory and import it
```python
import damas
```


### Web service
Or directly use the web service URL

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
