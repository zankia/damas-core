###  Run the server for the first time

First, please make sure to follow the implementation specific installation in `server-nodejs/README.md`. Then you can connect to the server at the address:

> localhost:8443/console.html

Where `localhost` means it is running on the local machine and `8443` is the configured port.

### Enable User Authentication

By default, the installation gives a public access without authentication. The first thing you may want to do is to setup the authentication. For this, you need to create a new user. We don't provide a button for this so here is the procedure using the damas-core API to create a user node:

In the web browser, on the console page, start a web console (Ctrl+Shft+K) and type:
```js
damas.create({username:"<your_user_name>", password:"<your_password>"});
```
by default this password is an SHA1 encoded string (that is encoded on your side). To generate the encoded password, you can type this command in a shell:
```sh
$ echo -n "starwars" | sha1sum
327156ab287c6aa52c8670e13163fc1bf660add4  -
```
You can change the hash encryption algorithm from `sha1` to `md5` and other options editing the server configuration file conf.json (as explained in server-nodejs/README.md) and enable the JSON Web Token authentication:

```javascript
{
    "auth" : "jwt",
// ...
    "jwt" : {
        "passwordHashAlgorithm" : "sha1",
        "secret" : "webtokensecret",
        "exp" : 1440
    },
// ...
}
```
Then, restart the server to read the configuration file at startup and sign in using the newly created user. You can also read this [[documentation|Authentication]] about the JSON Web Token base authentification in DAMAS.