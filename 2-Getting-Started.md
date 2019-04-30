##  Access the server for the first time

First, make sure you followed the instructions in [[Installation|1 Installation]].

Then you can try to connect to the server using a web browser at URL:
```
https://localhost:8443
```
Where `localhost` means it is running on the local machine and `8443` is the configured https port

### Enable User Authentication

By default, the installation gives a public access without authentication. The first thing you may want to do is to setup the authentication. For this, you need to create a new user. We don't provide a button for this so here is the procedure using the damas-core API to create a user node:

In the web browser, on the console page, start a web console (Ctrl+Shft+K) and type:
```js
damas.create({username:"your_user_name", password:"your_password", class:"admin"});
```
by default this password is an SHA1 encoded string (that is encoded on your side). To generate the encoded password, you can type this command in a shell:
```sh
$ echo -n "yourpassword" | sha1sum
327156ab287c6aa52c8670e13163fc1bf660add4  -
```
You can change the hash encryption algorithm from `sha1` to `md5` and other options editing the server configuration file conf.json (as explained in server-nodejs/README.md) and enable the JSON Web Token authentication:

```javascript
{
    "jwt" : {
        // ...
        "enable": true,
        "passwordHashAlgorithm" : "md5",
        // ...
    },
}
```
Then, restart the server to read the configuration file at startup and sign in using the newly created user. You can also read this [[documentation|Authentication]] about the JSON Web Token base authentification in DAMAS.

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
