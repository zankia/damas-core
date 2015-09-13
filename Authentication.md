# Token Based User Authentication [DRAFT]

[JSON web tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) are used for the new user authentication scheme (2015, NodeJS).

User's passwords are stored as SHA1 encoded strings in a `password` key under user nodes in the database.

## signIn
The `signIn()` method is used to request a token from the server:

```python
# Python
import damas
project = damas.http_connection("https://localhost:8443")
if project.signIn("demo","demo"):
    # The token is automatically used in further API calls
    user_id = project.search("username:demo")
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

The tokens expire at a certain duration after it was requested. This duration is configured on the server configuration file under the `conf.jwt.exp` key.

You can ask the server if the current token is still valid:
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


## NodeJS

The Express authentication middleware verifies tokens and permissions and stores the authenticated user node under the request object `req.user` and can be accessed in further processes which need to know the authenticated user properties (eg. the asset management part).

