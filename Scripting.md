Libraries for Python and Javascript languages are provided in order to access a server remotely, interface its methods and process the JSON results using the language native objects. Once you get a working environment for scripting, you can visit the [[API documentation|API]] for a complete reference about the available methods.

## Setup Python Environment

The _requests_ module needs to be installed.
On a Debian operating system you can install it using this command line:

```
$ sudo apt install python-requests
```

__damas.py__ is the Python module containing the damas-core API for Python, located in `/py/damas.py` in the damas-core repository.

```python
# Example use in a Python console
# import the module
>>> import damas
```

Then connect to a running server and start working with the nodes:

```python
# connect to your server
>>> project = damas.http_connection('http://xxx.xxx.xxx.xxx:8090')

# get an authentication token if the server is requesting authentication
>>> project.signIn("demouser","demouserpassword")

# create a new node
>>> project.create({"key1":"value1","key2":"value2"})
{u'key2': u'value2', u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'xxx.xxx.xxx.xxx'}

# search for this node using a key it is wearing
>>> project.search("key1:value1")
[u'55ae0b1ed81e88357d77d0e9']

# read the node index
>>> project.read('55ae0b1ed81e88357d77d0e9')
[{u'key2': u'value2', u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'xxx.xxx.xxx.xxx'}]

```

## Setup Javascript Environment
__damas.js__ is an AMD module containing the damas-core API for Javascript, located in `/js/damas.js` in the damas-core code repository. This module can be loaded in various environments.

### Using requireJS
```js
require('damas.js');
damas.server = "/api"; // the server is on the localhost
damas.signIn("demouser", "demouserpassword", function(res){
    if(!res)
    {
        // login failed
        return;
    }
    damas.create({"key1":"value1","key2":"value2"});
});

```
#### In HTML Documents
Include the library from a HTML document
```html
<html>
    <head>
        <script type="text/javascript" src="damas.js"></script>
        <script type="text/javascript">
            // your code here
        </script>
    </head>
    <body>
    </body>
</html>
```

# Documentation
The [[API documentation|API]] in this wiki is a reference for a complete list of the methods available in the API.

<!--
## Web service
You can directly use the web service urls with curl for example.

Search every /production asset on the server
```
http://yourserver/search/file:/^production
```

## Script examples from version 2.2
```js
// Javascript
// Parse the current node's children, retrieve the 'file' key from the first grand-child, and set it on the child
damas.current_node.children.each( function(n){
    var file = damas.children(n.id)[0].keys.get('file');
    damas.update(n.id, {file: file});
});
```
-->