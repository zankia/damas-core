# Bash client

## Setting up

You can place `damas.sh` anywhere you want (for example `/usr/bin/damas`)

In order to run it, you need to have a `.damas` directory in the root directory of your project (like git).
In this directory, there to be a `config` file like this : 

```bash
URL="http://localhost:8090/api/"
```

## Usage

All commands use the same syntax : `damas action --arguments files`

* `action` is listed with `damas --help`
* `-j` or `--json` arguments has to be written like this : `'"key1": "value", "key2": ["array", "of", "elements"]'`
* `files` is the path of the different files (absolute or not) separated by spaces. It supports wildcards

At the end, stdout is filled with a json object or nothing (if something went wrong or the action doesn't output anything)

## Authentification

If the server uses JSON Web Tokens (`"auth" : "jwt"` in server config), you will need to identify yourself in order to perform any action. There are two ways to authenticate : 

* `damas signin <username> <password>`
* By performing any action, you will be asked to authenticate by typing your username then your password

The authentication token is stored in `/tmp/damas-<username>'. Only root and you can read it and it is removed whenever the system reboots

## Go further

Possible improvements are the following : 

* Auto-generating config file
* Switch json and line by line informations output
* Make json input easier to use (how?)
* Make authentification automated like ssh
* Tell if signin worked well or not