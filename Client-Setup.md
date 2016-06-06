We provide the libraries for the Python and Javascript languages to access the damas-core server remotely, and interface its methods and the JSON results using the language native objects. Once you get a working environment for scripting, you can visit the [[API reference|API reference]] for a complete reference about the available methods.

## Contents
* [Python](#python-client)
* [Javascript](#javascript-client)
* [Command-line](#command-line-interface)
* [Curl](#curl-commands)
* [Documentation](#documentation)


## Python Client
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
>>> project = damas.http_connection('http://localhost:8090/api')

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


## Javascript Client
__damas.js__ is an AMD module containing the damas-core API for Javascript, located in `/js/damas.js` in the damas-core code repository. This module can be loaded in various environments.

### In HTML Documents
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


## Command-line Interface

### Setting up

You can place `damas.sh` anywhere you want (for example `/usr/bin/damas`)

In order to run it, you need to have a `.damas` directory in the root directory of your project (like git).
In this directory, there to be a `config` file like this : 

```bash
URL="http://localhost:8090/api/"
```

### Usage

All commands use the same syntax : `damas action --arguments files`

* `action` is listed with `damas --help`
* `-j` or `--json` arguments has to be written like this : `'"key1": "value", "key2": ["array", "of", "elements"]'`
* `files` is the path of the different files (absolute or not) separated by spaces. It supports wildcards

At the end, stdout is filled with a json object or nothing (if something went wrong or the action doesn't output anything)

### Authentification

If the server uses JSON Web Tokens (`"auth" : "jwt"` in server config), you will need to identify yourself in order to perform any action. There are two ways to authenticate : 

* `damas signin <username> <password>`
* By performing any action, you will be asked to authenticate by typing your username then your password

The authentication token is stored in `/tmp/damas-<username>'. Only root and you can read it and it is removed whenever the system reboots

### Go further

Possible improvements are the following : 

* Auto-generating config file
* Switch json and line by line informations output
* Make json input easier to use (how?)
* Make authentification automated like ssh
* Tell if signin worked well or not


## Curl Commands
Command line access to the server using curl. Request an access token from the server:

```sh
$ curl -k https://localhost:8443/api/signIn -d "username=xxx&password=yyy" > /tmp/token
```

Read the token:
```sh
$ cat /tmp/token
{"_id":"56029d03dff07e50a860a09d","username":"remyla","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NjAyOWQwM2RmZjA3ZTUwYTg2MGEwOWQiLCJ1x2VybmFtZSI6InJlbXlsYSIsImlhdCI6MTQ1NDA3ODY1MiwiZXhwIjoxNDU0MTY1MDUyfQ.5AhJIh6ReeS2y6H0Mpcx8fJralsTDSidJAniuaJiVP8","token_exp":1454165052,"token_iat":1454078652}
```

Use the token:
```sh
$ curl -k https://localhost:8445/api/verify -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NjAyOWQwM2RmZjA3ZTUwYTg2MGEwOWQiLCJ1x2VybmFtZSI6InJlbXlsYSIsImlhdCI6MTQ1NDA3ODY1MiwiZXhwIjoxNDU0MTY1MDUyfQ.5AhJIh6ReeS2y6H0Mpcx8fJralsTDSidJAniuaJiVP8"
{"_id":"56029d03dff07e50a860a09d","username":"remyla","iat":1454078652,"exp":1454165052}
```


# Documentation
The [[API documentation|API reference]] in this wiki is a reference for a complete list of the methods available in the API.

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
