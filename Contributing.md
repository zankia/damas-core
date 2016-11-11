# Table of Contents
* [Protocol Specifications](#protocol-specifications)
* [Running Tests](#running-tests)
* [JS Code Conventions](#js-code-conventions)

# Protocol Specifications
The communication protocol is built on top of HTTP. This chapter describes the queries, responses, and possible error codes to help building consistent and compatible implementations of clients and servers.

## create
* Request `POST` `/api/create/` `application/json` object or array of objects
* Response `201` `application/json` OK (created node(s))
* Response `207` `application/json` Multi-Status (some nodes were conflictuous, the others are created)
* Response `400` `text/html` Bad Request (not formatted correctly)
* Response `409` `text/html` Conflict (no node was created, probably due to an `_id` conflict)

In case of a successful multiple node creation, the returned json is a list of nodes ordered using the same order as the provided input.

## read
* Request `GET` `/api/read/id1,id2`
* Request `POST` `/api/read/` `application/json` node identifier or array of node identifiers
* Response `200` `application/json` OK (node or array of nodes)
* Response `400` `text/html` Bad Request (not formatted correctly)
* Response `404` `text/html` Not Found (the nodes do not exists)

The POST method is used in order to bypass the limits of the size of the URL (80KB for NodeJS). The GET method remains.

## update
* Request `PUT` `/api/update/` `application/json` node or array of nodes
* Response `200` `application/json` OK (updated node or array of updated nodes)
* Response `400` `text/html` Bad Request (not formatted correctly)
* Response `403` `text/html` Forbidden (the user does not have the right permission)
* Response `404` `text/html` Not Found (the nodes do not exist)

The input accepts arrays for _id keys to perform updates of the same kind on multiple nodes. Unspecified keys will be unchanged in the database. A key with null value deletes the key.

## delete
* Request `DELETE` `/api/ids`
* Response `200` `application/json` deleted node or array of deleted nodes
* Response `207` `application/json` array of deleted nodes or null (partial)
* Response `400` `text/html` error message (bad request)
* Response `404` `text/html` error message (node not found)

## search_one
* Request `GET` `/api/search_one/`query
* Response `200` `application/json` node or null
* Response `400` `409` `text/html` error message

## search_mongo
* Request `POST` `/api/search_mongo` `application/json` `query` `sort` `limit` `skip`
* Response `200` `application/json` array of string identifiers
* Response `409` `text/html` error message

##signIn
* Request `POST` `/api/signIn/` `application/x-www-form-urlencoded` `username` `password`
* Response `200` `application/json` user object
* Response `401` `text/html` error message

## signOut
* Request `/api/signOut/`
* Response

## /api/verify
* Request `GET` `/api/verify/`
* Response `200` `application/json` the authenticated user object
* Response `401`

the following operations are drafts

## version
* Request `POST` `/api/version/id` `application/json`
* Response `200` `400` `401` `application/json`

## link
* Request `POST` `/api/link` `application/json`
* Response `200` `400` `401` `application/json`


* in `/server-tests/` - tests of the REST API using http://jasmine.github.io/
* the tests are to be run on code from the same development branch (master, testing or experimental)
* `/server-nodejs/tests` - tests for the nodejs server using mocha

# Running tests
## Installation
### Mocha

To get started, you need to install some modules in server-nodejs :
```
npm install mocha chai chai-as-promised supertest
```

Once mocha is started, every time you save modifications in a file the server is using, tests are made automatically

### Jasmine

To get started, you need to install some modules in server-tests :
```
npm install
```

Edit `conf-tests-frisby.json` as you need

## Run

To run tests, simply type the following command in the appropriate directory :

```
npm test
```

If you have this error :

```
/usr/bin/env: node: No such file or directory
```
then modify the shebang of the command (node_modules/{moduleName}/bin/{moduleName}) to `#!/usr/bin/env `**`nodejs`** or create an alias `node` -> `nodejs`

##Tests results

Fun fact : Mocha did a really strange thing : it changes `'Foo'` into `{Foo:''}` when it is sent in POST

Anyway, the priority is now given to Jasmine/Frisby.

The latter is now testing Create, Read, Update, Delete, Graph, Lock, Unlock.

It revealed that:
* Read and Graph returns a non empty array, the parameter is not found.
* Read in POST needs an object which contains the key `id` as parameter
* Lock and Unlock make server crash if parameter is not found
* Delete doesn't throw the right errors


# JS Code conventions

Abstract: as we start a new coding session with teammates we want to stick to a reference as explained in the issue [#99](../issues/99).

We mainly want to stick to the Crockford document. It will become our reference for this list:
* Variable Declaration
* indentation: 4 spaces
* 2 line return at the end of file

http://javascript.crockford.com/code.html

## Conditions

```js
if (null == variable) {
    return null;
} else if ('test' !== variable) {
    return false;
} else {
    // code...
}
```
1. When appliable, check the constant value before the variable.
It allows for more visibility in the code, and prevents unwanted assignments.

2. For multiple conditions, put the next one on the same line as the last closing bracket.

3. Use the strict equality check `===`, except when we want to test for equivalent values.

4. Always use braces and put the instructions on a new line. Even for single-line conditions containing a return statement.
This way we can insert new instructions within the same condition without modifying existing lines.

## Variables

```js
var i = 0;
var maximumValue = list.length;
i  = 1;
i += 2;
```

1. Always use the `var` keyword for each variable.

2. Don't vertically align operators, unless you do so for the same variable ; this way the lines are not dependent.
