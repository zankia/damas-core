# Token Based User Authentication [DRAFT]

[JSON web tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) are used for the new user authentication scheme (2015, NodeJS).

User's passwords are stored as encoded strings in a `password` key under user nodes in the database.

## signIn
The `signIn()` method is used to request a token from the server:

```python
# Python
import damas
project = damas.http_connection("https://localhost:8443")
if project.signIn("demo","demo"):
    # The token is automatically used in further API calls
    new_node = project.create({"label":"test","key2":"test")
else:
    print "Invalid username or password"
```
The server compares the provided username and password with the pair available in the database. It is important to encrypt the communication (using https here) not to send the password as clear text.

## The Token

```python
# Python
project.token['username']  # The user name used to log in
project.token['token']     # The actual encrypted json web token
project.token['token_exp'] # The time at which the token expires (Unix timestamp in seconds)
project.token['token_iat'] # The time when the token was generated
project.token['_id']       # The user node id
```

You can ask the server if the current token is still valid and didn't expire:
```python
# Python
if project.verify():
    print "ok"
else:
    print "token expired"
```

## User administration
Users are regular nodes, we can create, update or delete them using the API.

Creation of a user using Python:
```python
# Python
# Load the module for sha1 encryption
import hashlib
p = hashlib.sha1()
p.update('johnpassword')
# Create the user
project.create({"username":"john", "password": p.hexdigest(), "email":"john@me.com" })
```

Delete a user using Python:
```python
# Python
# Delete the user using its name
project.delete(project.search("username:john")[0])
```

## Configuration

The configuration options of this module are located in the configuration file `server-nodejs/conf.json` under the `jwt` section.

`jwt.passwordHashAlgorithm` is the hash algorithm used to compare passwords. Possible values are `sha1` or `md5`.

`jwt.exp` the number of minutes after which tokens expire

`jwt.secret` the secret passphrase used to encode and decode tokens

## Permissions
Users can be assigned to a group with the `class` key.

Possible values are `guest` (default), `user`, `editor` and `admin`

|              | Guest | User | Editor | Admin |
|--------------|-------|------|--------|-------|
|    create    |       |      |    X   |   X   |
|     read     |   X   |   X  |    X   |   X   |
|    update    |       |      |    X   |   X   |
|    delete    |       |      |    X   |   X   |
|     lock     |       |   X  |    X   |   X   |
|    unlock    |       |   X  |    X   |   X   |
|    publish   |       |   X  |    X   |   X   |
|    upload    |       |   X  |    X   |   X   |
|    version   |       |   X  |    X   |   X   |
|     file     |       |   X  |    X   |   X   |
|     graph    |   X   |   X  |    X   |   X   |
|    search    |   X   |   X  |    X   |   X   |
| search_mongo |   X   |   X  |    X   |   X   |

## NodeJS

The Express authentication middleware verifies tokens and permissions and stores the authenticated user node under the request object `req.user` and can be accessed in further processes which need to know the authenticated user properties (eg. the asset management part).

