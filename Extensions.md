Extensions give new behaviors to the nodejs-server: extend the api, manage user authentication, permissions. This page gives a list of the extensions which are provided in the repository.

* [`es6-polyfills`](#es6-polyfills) - polyfills for older systems
* [`jwt`](#jwt) - JSON Web Token user authentication
* [`jwt_delegate`](#jwt_delegate) - centralize authentication on a different server
* [`last_activity`](#last_activity) - keep the last activity for current user.
* [`noauth`](#noauth) - user verification mechanism when user authentication is disabled.
* [`nodemailer`](#nodemailer) - send emails using https://www.npmjs.com/package/nodemailer
* [`restricted_keys`](#restricted_keys) - whitelist of writable keys depending on user class
* [`prefer_https`](#prefer_https) - redirect every HTTP queries to HTTPS
* [`static_routes`](#static_routes) - files and folders to be served by the server
* [`user_setup`](#user_setup) - manage user password reset

The extensions are loaded at startup and are listed in the configuration file `conf.json`. They are loaded by order of appearance in that file. The extensions are defined using a simple format:
```json
{
    "extensions": {
        "extension_name": {
            "path": "extension_dir/extend.js",
        }
    }
}
```
`enable` and `conf` keys are optional. Omitting them means that the extension is enabled and that it does not need configuration. `path` and `conf` can be relative paths or absolute paths:
```js
"aforge": {
    "enable": true,
    "path": "./aforge/aforge.js",
    "conf": {
        "apiKey": "________"
    }
}
```

## es6-polyfills
Provide ES6 polyfills if the code is ran in a NodeJS which is not ES6.
(NodeJS v0.10.29 for instance, on older systems)
* default configuration:
```js
"es6_polyfills": {
    "enable": true,
    "path": "./extensions/es6_polyfills.js"
}
```

## jwt
Implementation of JSON Web Token RFC7519 for user authentication https://jwt.io/  
* requires `jsonwebtoken` `express-jwt` `express-unless` `crypto` `cookie-parser`
* new routes: `/api/signIn` and `/api/verify`
* default configuration:
```js
"jwt": {
    "enable": false,
    "path": "./extensions/jwt.js",
    "conf": {
        "required": true,
        "passwordHashAlgorithm": "md5",
        "secret": "webtokensecret",
        "exp": 1440,
        "expressUse": "/api",
        "expressUnless": {
            "path": "/api/signIn"
        }
    }
}
```
* configuration options:
  * `required` (boolean) if false, unauthenticated users are considered as guests with read access
  * `passwordHashAlgorithm` (string) algorithm used to hash the passwords on server. `sha1` or `md5`
  * `secret` (string)  encryption salt
  * `exp` (number) token default expiration time default is `1d` (options: https://www.npmjs.com/package/ms)
  * `expressUse` (string, regex or array) paths to protect with authentication
  * `expressUnless` (object) paths and methods to exclude from authentication

See [[Authentication]], [express.use syntax](https://expressjs.com/en/api.html#app.use), [express unless syntax](https://www.npmjs.com/package/express-unless).

## jwt_delegate
Centralizing authentication on a different server than the tracker.
The user node will be save in the tracker database or update. [(learn more)](https://github.com/remyla/damas-core/wiki/Authentication#signin)
* default configuration :
```js
"jwt_delegate": {
    "enable": true,
    "path": "./extensions/jwt_delegate.js",
    "conf": { 
        "server": "https://syncplanet.io/api/signIn/"
    }
},
```
* Create a new request and submit it to the server

## last_activity
Save the date when user makes a request.
* default configuration:
```js
"last_activity": {
    "enable": true,
    "path": "./extensions/last_activity.js"
},
```
## noauth
Provides basic user verification mechanisms when authentication is disabled.
* new routes: `/api/verify`
* default configuration:
```js
"noauth": {
    "enable": true,
    "path": "./extensions/auth-none.js"
}
```

## nodemailer
Send email using https://www.npmjs.com/package/nodemailer
* requires `nodemailer`
* default configuration:
```
"nodemailer": {
    "enable": true,
    "path": "./extensions/nodemailer.js",
    "conf": {
        "transporter":{
            "host": "localhost",
            "port": 25, 
            "secure": false
        },  
        "from": "\"Sender\" <noreply@example.com>"
    }   
}  
```
* configuration options:
  * `transporter` (object) nodemailer configuration
  * `from` (string) default sender email address
See [nodemailer](https://www.npmjs.com/package/nodemailer)

## restricted_keys
Replace keys in requests by default ones if the user class is not in the whitelist. If the new value is defined as null, delete the key from the request
* default configuration:
```js
"restricted_keys": {
    "enable": true,
    "path": "./extensions/restricted_keys.js",
    "conf": {
        "whitelist": ["admin"],
        "override": { "active": false, "author": null, "class": null, "time": null, "username": null }
    }
}
```
* configuration options:
  * `whitelist` (array) user classes that are not affected by key restriction
  * `override` (object) keys and behaviors upon updates

## prefer_https
Redirects http:// calls to https://.
* default configuration:
```js
"prefer_https": {
    "enable": false,
    "path": "./extensions/prefer_https.js"
}
```
The /.well-known is not redirected to allow letsencrypt authentication. See Express [res.redirect](https://expressjs.com/en/api.html#res.redirect)

## static_routes
A list of relative or absolute paths to be served by the server. It contains server resources and possible HTML interfaces.
* new routes are defined according to the configuration
* default configuration:
```js
"static_routes": {
    "enable": true,
    "path": "./extensions/static_routes.js",
    "conf": {
        "routes": {
            "/": "public",
            "/js": "../js",
            "/cli": "../cli",
            "/py": "../py",
            "/api": "public/index.html",
            "/signIn": "extensions/auth_signIn.html"
        }
     }
}
```
* configuration options:
  * `routes` (object) route -> path pairs to define
An array as value for a directory means that it will look for a resource in each directory by order of appearance. 

## user_setup
Lost password procedure using email and token verification.
* requires `crypto`
* new routes: `/api/lostPassword` `/api/changePassword` `/api/resetPassword`
* default configuration:
```json
"user_setup" : { 
    "enable": true,
    "path" : "./extensions/user_setup.js"
}
```
