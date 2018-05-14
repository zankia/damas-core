
_(Draft)_

This page gives a list and additionnal information about the extensions provided in this repository.

```json
    "extensions": {
        "es6_polyfills": {
            "enable": true,
            "path": "./extensions/es6_polyfills.js"
        },
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
        },
        "noauth": {
            "enable": true,
            "path": "./extensions/auth-none.js"
        },
        "restricted_keys": {
            "enable": true,
            "path": "./extensions/restricted_keys.js",
            "conf": {
                "whitelist": ["admin"],
                "override": { "active": false, "author": null, "class": null, "time": null, "username": null }
            }
        },
        "prefer_https": {
            "enable": false,
            "path": "./extensions/prefer_https.js"
        },
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
    }   
```

## es6-polyfills
Provide polyfills if the code is ran in a NodeJS which is not ES6.
(NodeJS v0.10.29 for instance, on older systems)


## jwt
JSON Web Token extension for user authentication.

* `passwordHashAlgorithm`: `sha1` or `md5`
* `secret`:  encryption salt string
* `exp`: token expiration time in seconds

## noauth
Provides basic user verification mechanisms in case of no authentication.

## prefer_https
Redirects http calls to https unless for letsencrypt authentication files (.well-known)

## static_routes
A list of relative or absolute paths to be served by the server. It contains server resources and possible HTML interfaces.


## https
By default the SSL is disabled in the configuration template.
```json
"https" : { 
    "enable": false,
    "cert": "cert.pem",
    "key": "key.pem"
}
```  
To enable SSL specify `"enable: true"` and the SSL certificate files tu use (usually `key.pem` and `cert.pem`) in conf.json.

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

