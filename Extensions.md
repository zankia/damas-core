Extensions give new behaviors to the nodejs-server: extend the api, manage user authentication, permissions. This page gives a list of the extensions which are provided in the repository.

* [`es6-polyfills`](#es6-polyfills) - polyfills for older systems
* [`jwt`](#jwt) - JSON Web Token user authentication
* [`noauth`](#noauth) - user verification mechanism when user authentication is disabled.
* [`last_activity`](#last_activity) - keep the last activity for current user.
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
```js
"es6_polyfills": {
    "enable": true,
    "path": "./extensions/es6_polyfills.js"
}
```

## jwt
Implementation of JSON Web Token RFC7519 for user authentication https://jwt.io/  

```js
"jwt": {
    "enable": false,
    "path": "./extensions/auth-jwt-node.js",
    "conf": {
        "required": false,
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
* `passwordHashAlgorithm`: algorithm to store passwords on server. `sha1` or `md5`
* `secret`:  encryption salt string
* `exp`: token expiration time in seconds
* `expressUse`: path to protect by authentication
* `expressUnless`: path to exclude from authentication

See [[Authentication]] documentation about this implementation.

* requires `jsonwebtoken` `express-jwt` `express-unless` `crypto` `cookie-parser`
* new routes: `/api/signIn` and `/api/verify`


## noauth
Provides basic user verification mechanisms when authentication is disabled.
```js
"noauth": {
    "enable": true,
    "path": "./extensions/auth-none.js"
}
```
* new routes: `/api/verify`


## nodemailer
Send email using https://www.npmjs.com/package/nodemailer
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
* requires `nodemailer`
* no route defined

## restricted_keys
Replace keys by default ones if the user class is not in the whitelist. If the new value is defined as null, delete the key from the request

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
* no route defined


## last_activity
Keep the last activity for current user.
```js
"last_activity": {
            "enable": true,
            "path": "./extensions/last_activity.js"
},
```


## prefer_https
Redirects http calls to https.
```js
"prefer_https": {
    "enable": false,
    "path": "./extensions/prefer_https.js"
}
```
* no new route defined

The /.well-known is not redirected, to allow letsencrypt authentication.

## static_routes
A list of relative or absolute paths to be served by the server. It contains server resources and possible HTML interfaces.
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
An array as value for a directory means that it will look for a resource in each directory by order of appearance. 
* new routes are defined according to the configuration

## user_setup
Lost password procedure using email and token verification.

```json
"user_setup" : { 
    "enable": true,
    "path" : "./extensions/user_setup.js"
}
```
* requires `crypto`
* new routes: `/api/lostPassword` `/api/changePassword` `/api/resetPassword`
