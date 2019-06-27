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

The module [jwt_delegate](https://github.com/remyla/damas-core/wiki/Extensions#jwt_delegate) centralize authentications on a delegated server in the file configuration : conf.json. When an user authenticates, the module creates a new request based on the request of the user, with the username and password and it will be sent to the delegated server. The user node is registered in the server (the origin of the request) database or updated if it already exists. <!--This module works with a server version published in this commit.-->

## Password Hash
During auhthentication, we detect the [hash method](https://github.com/remyla/damas-core/wiki/2-Getting-Started#enable-user-authentication) stored in database. 

## The Token
The token is a string allowing to verify a user. Each token is genereted with a lifespan and some other information(see [JWT](https://jwt.io/introduction/) and [npm JSONWebToken](https://www.npmjs.com/package/jsonwebtoken)).
#### Token lifespan
By default, the lifespan is set to `exp` in conf.json. With signIn, we can inform `expiresIn` (see [signIn](https://github.com/remyla/damas-core/wiki/3-API-reference#signin)) to get an other lifespan. The possible values are specified [here](https://www.npmjs.com/package/ms). Special value: if expiresIn equals `"0"` the lifespan will be unlimited [#237](https://github.com/remyla/damas-core/issues/237). By changing password, this revokes previously obtained tokens.  
#### Token salt
The tokens are encrypted using salts (a secret passphrase on server). The salt is made with the user hashed password and the `secret` passphrasse specified in conf.json. If we change either one the previously obtained tokens will be revoked.


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

We store a property `disable` under the user node. If disable is true, the user will not be able to signIn or use his user account. By default, the users are not disabled.

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

## NodeJS

The Express authentication middleware verifies tokens and permissions and stores the authenticated user node under the request object `req.user` and can be accessed in further processes which need to know the authenticated user properties (eg. the asset management part).

