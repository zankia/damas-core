First, make sure you followed the instructions in [[Installation|1 Installation]].

## Security

### Enable TLS
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

### Enable User Authentication
By default, the installation gives a public access without authentication. The first thing you may want to do is to setup the authentication. For this, you need to create a new user. We don't provide a button for this so here is the procedure using the damas-core API to create a user node.

To generate a SHA-1 or MD5 encoded password, you can type this command in a shell:
```sh
$ echo -n "yourpassword" | sha1sum
327156ab287c6aa52c8670e13163fc1bf660add4  -
```
```sh
$ echo -n "yourpassword" | md5sum
637b9adadf7acce5c70e5d327a725b13  -
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
            "exp": "1d",
        }
    },
}
```
Then, restart the server to read the configuration file at startup and sign in using the newly created user. You can also read this [[documentation|Authentication]] about the JSON Web Token authentification in damas-core and to have more details about the authentication options.

The `required` directive is used for hybrid cases where:
* authentication is required for write accesses
* unauthenticated users are still able to read the database and considered as `guest` class users

### Permissions

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


## Clients

https://demo.damas.io hosts a fresh damas-core server install on which you can test your clients.

### Python Client
https://demo.damas.io/py/ gives explanations about the Python client and how to try it with the demo server.

__damas.py__ is a module containing the damas-core client API for Python. It is located under `/py/damas.py` in the damas-core repository. It depends on the `requests` module. On a Debian operating system you can install the `request` module using this command line:
```sh
$ sudo apt install python-requests
```

```python
# Example use in a Python console
# import the module
>>> import damas
```

Then connect to a running server and start working with the nodes:

```python
# connect to your server
>>> project = damas.http_connection('http://localhost:8090')

# if the server requires authentication
>>> project.signIn("user","userpassword")

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


### Javascript Client
https://demo.damas.io/js/ has the Javascript damas-core client API loaded and ready to try it with the demo server using a web browser.

`/js/damas.js` in the damas-core repository is an AMD module containing the client API for Javascript. This module can be loaded in various environments.

#### In HTML Documents
Include the library from a HTML document
```html
<html>
    <head>
        <script src="damas.js"></script>
        <script>
            damas.server = ''; // your server URL
            // your code here
        </script>
    </head>
    <body>
    </body>
</html>
```
> damas.server is set to an empty string if your page is directly served by damas-core

#### Using requireJS
```js
require('damas.js');
damas.server = ''; // the server is on the localhost
damas.signIn("demouser", "demouserpassword", function(res){
    if (!res) {
        // login failed
        return;
    }
    damas.create({"key1":"value1","key2":"value2"});
});
```
Under NodeJS, the `xmlhttprequest` module is required:
```sh
npm install xmlhttprequest
```
Also, CustomEvent is used in this module. Comment the 2 lines invoking CustomEvent if needed under NodeJS. This module would become a ready-to-use npm module if we get more clients using NodeJS.  

### Command-line Interface
https://demo.damas.io/cli/ gives explanations about the bash client and how to try it with the demo server.

#### Install the `damas` command on your system
Install from this repository:
```sh
cp cli/damas.sh /usr/bin/damas
```
Install from the gitHub repository:
```sh
sudo curl -L "https://raw.githubusercontent.com/remyla/damas-core/experimental/cli/damas.sh)" -o /usr/bin/damas
```
Then make the command executable:
```sh
chmod +x /usr/bin/damas
```

The manual page of the command can be found at https://demo.damas.io/cli/ or in this repository under `/cli/README.md`.

If the server requires authentication (the demo server has no authentication) you can use `damas signin <username> <password>` command to get a token which is stored in `/tmp/damas-<username>'. Only root and you can read it and it is removed whenever the system reboots

### Curl Commands
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