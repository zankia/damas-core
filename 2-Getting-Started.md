First, make sure you followed the instructions in [[Installation|1 Installation]].

## Enable TLS
For a server which will run on a network you should enable the security layer in conf.json:
```json
{
    "https" : { 
        "enable": true,
        "cert": "fullchain.pem",
        "key": "privkey.pem"
    }
}
```
You can use Let's Encrypt to obtain a certificate:
```sh
docker run --rm --name certbot -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot certonly -q --standalone --agree-tos -m YOUR@EMAIL.COM -d YOUR_DOMAIN_NAME
```

Or generate a self signed certificate:
```sh
openssl req -new -x509 -days 9999 -nodes -out fullchain.pem -keyout privkey.pem
```


## Enable User Authentication

By default, the installation gives a public access without authentication. The first thing you may want to do is to setup the authentication. For this, you need to create a new user. We don't provide a button for this so here is the procedure using the damas-core API to create a user node.

To generate a SHA-1 encoded password, you can type this command in a shell:
```sh
$ echo -n "yourpassword" | sha1sum
327156ab287c6aa52c8670e13163fc1bf660add4  -
```

In the web browser, on damas-core page, start a web console (Ctrl+Shift+K) and type:
```js
// Welcome to damas-core API
damas.create({username:"yourusername", password:"327156ab287c6aa52c8670e13163fc1bf660add4", class:"admin"});
```

Then you can enable the JSON Web Token authentication editing the server configuration file conf.json:
```js
{
    "jwt" : {
        "enable": true,
        "conf": {
            "required": true,
            "secret": "webtokensecret",
            "exp": 1440,
        }
    },
}
```
Then, restart the server to read the configuration file at startup and sign in using the newly created user. You can also read this [[documentation|Authentication]] about the JSON Web Token authentification in damas-core and to have more details about the authentication options.

## Permissions

We have different types of permissions:

* permissions for each /api/ operation based on the current user's `class` key: hard-coded in server-nodejs/routes/perms-tools.js
* update permissions based on the key name to edit and the current user's `class` key. [extensions/restricted_keys.js](../Extensions#restricted_keys)
* read permissions based on the `author` key. See conf.json `authorMode` directive. 

The default available user classes are: `admin` `editor` `user` `guest`.


|  Operation   | guest | user | editor | admin |
|--------------|-------|------|--------|-------|
|    create    |       |   x  |    x   |   x   |
|     read     |   x   |   x  |    x   |   x   |
|    update    |       |   k  |    x   |   x   |
|    delete    |       |      |    x   |   x   |
|     lock     |       |   x  |    x   |   x   |
|    unlock    |       |   x  |    x   |   x   |
|    publish   |       |   x  |    x   |   x   |
|    upload    |       |   x  |    x   |   x   |
|    version   |       |   x  |    x   |   x   |
|     file     |       |   x  |    x   |   x   |
|     graph    |   x   |   x  |    x   |   x   |
|    search    |   x   |   x  |    x   |   x   |
| search_mongo |   x   |   x  |    x   |   x   |



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
            damas.server = "http://localhost/api/"; // your server URL
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
    if (!res) {
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
* `-h` or `--human` is to get a human readable output
* `files` is the path of the different files (absolute or not) separated by spaces. It supports wildcards

At the end, stdout is filled with a json object or nothing (if something went wrong or the action doesn't output anything)

### Authentification

If the server uses JSON Web Tokens (`"auth" : "jwt"` in server config), you will need to identify yourself in order to perform any action. There are two ways to authenticate : 

* `damas signin <username> <password>`
* By performing any action, you will be asked to authenticate by typing your username then your password

The authentication token is stored in `/tmp/damas-<username>'. Only root and you can read it and it is removed whenever the system reboots


## Curl Commands
Command line access to the server using curl. Request an access token from the server:

```sh
$ curl https://localhost/api/signIn -d "username=remyla&password=yyy" > /tmp/token
```

Read the token:
```sh
$ cat /tmp/token
{"_id":"56029d03dff07e50a860a09d","username":"remyla","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NjAyOWQwM2RmZjA3ZTUwYTg2MGEwOWQiLCJ1x2VybmFtZSI6InJlbXlsYSIsImlhdCI6MTQ1NDA3ODY1MiwiZXhwIjoxNDU0MTY1MDUyfQ.5AhJIh6ReeS2y6H0Mpcx8fJralsTDSidJAniuaJiVP8","token_exp":1454165052,"token_iat":1454078652}
```

Use the token:
```sh
$ curl https://localhost/api/verify -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NjAyOWQwM2RmZjA3ZTUwYTg2MGEwOWQiLCJ1x2VybmFtZSI6InJlbXlsYSIsImlhdCI6MTQ1NDA3ODY1MiwiZXhwIjoxNDU0MTY1MDUyfQ.5AhJIh6ReeS2y6H0Mpcx8fJralsTDSidJAniuaJiVP8"
{"_id":"56029d03dff07e50a860a09d","username":"remyla","iat":1454078652,"exp":1454165052}
```

## Next steps
Now that you have a running server and client environments you could continue reading [[3 API Reference]] and [[4 Specifications]].

If you encounter any difficulty during the setup process you could create an issue describing the problem in this repository and we will try to resolve it.