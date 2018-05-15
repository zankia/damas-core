This page gives a list and additional information about the extensions provided in this repository. The extensions are defined in the main configuration file `conf.json` of the server under a `extensions` section and are loaded when the server starts by order of appearance in that file.

The extensions have different purposes, giving new behaviours to the server, extend its api, provide more routes to express, or extend the data model.

[`es6-polyfill`](#es6-polyfill)
[`jwt`](#jwt)
[`noauth`](#noauth)
[`restricted_keys`](#restricted_keys)
[`prefer_https`](#prefer_https)
[`static_routes`](#static_routes)

## Abstract about extensions

Adding an extension consists in:
* adding a js
* adding a configuration JSON

In conf.json we have a `extensions` section holding the list of extensions to load at application startup:
```json
{
    "extensions": {
    }
}
```

The format to define an extension in conf.json:
```js
"extension_name": {
    "enable": true,
    "path": "extension_dir/new_routes.js",
    "conf": "extension_dir/config_file.json"
}
```
The `enable` and `conf` keys are optional. Omitting them means that the extension is enabled and no configuration is needed. `path` and `conf` can be relative or absolute.

The `conf` item can hold a JSON object for inline configuration or a string type which in that case will be included:  
```js
"forge": {
    "enable": true,
    "path": "forge/forge.js",
    "conf": {
        "apiKey": "________"
    }
}
```

## es6-polyfills
Provide polyfills if the code is ran in a NodeJS which is not ES6.
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
        "passwordHashAlgorithm": "sha1",
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

New routes defined: `/api/signIn` and `/api/verify`  
See [[Authentication]] documentation about this implementation.

## noauth
Provides basic user verification mechanisms when user authentication is disabled.
```js
"noauth": {
    "enable": true,
    "path": "./extensions/auth-none.js"
}
```
New routes defined: `/api/verify`

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

## prefer_https
Redirects http calls to https unless for letsencrypt authentication files (.well-known)
```js
"prefer_https": {
    "enable": false,
    "path": "./extensions/prefer_https.js"
}
```
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

## https
This is not a real extension as it is hard coded, so this section may move later on.
By default the SSL is disabled in the configuration template.
```json
"https" : { 
    "enable": false,
    "cert": "cert.pem",
    "key": "key.pem"
}
```  
To enable SSL specify `"enable: true"` and the SSL certificate files to use (usually `key.pem` and `cert.pem`) in conf.json.

### Generate a certificate

#### Letsencrypt  
If you need to generate a certificate, you can use certbot with the following command to generates keys in /etc/letsencrypt/config-dir/live/ :
```shell
docker run --name certbot -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot certonly -q --standalone --agree-tos -m YOUR@EMAIL.COM -d YOUR_DOMAIN_NAME
```

#### Self Signed  
In case you need to quickly create a self signed SSL certificate in order to use https you may find this line useful
```sh
openssl req -new -x509 -days 9999 -nodes -out cert.pem -keyout key.pem
```

