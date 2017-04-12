# Table of Contents
* [Protocol Specifications](#protocol-specifications)
* [Running Tests](#running-tests)
* [JS Code Conventions](#js-code-conventions)

# Protocol Specifications
The communication protocol is built over HTTP. This chapter describes the service operations, the possible responses and error codes to built consistent and compatible implementations of damas clients and servers.

## publish
Insert new nodes. Similar to the generic create operation but accessible to the user class, and also performs some verifications of the keys provided as argument.

HTTP Requests
* `POST` `/api/publish/` `application/json` object or array of objects

HTTP response status codes
```
201 OK (node(s) created)                                           application/json (object or array of objects)
207 Multi-Status (some nodes already exist with these identifiers) application/json (array of objects or null)
400 Bad Request (not formatted correctly)                          text/html        (error message)
403 Forbidden (the user does not have the right permission)        text/html        (error message)
409 Conflict (all nodes already exist with these identifiers)      text/html        (error message)
```
## create
Insert new nodes

HTTP Requests
* `POST` `/api/create/` `application/json` object or array of objects

HTTP response status codes
```
201 OK (node(s) created)                                           application/json (object or array of objects)
207 Multi-Status (some nodes already exist with these identifiers) application/json (array of objects or null)
400 Bad Request (not formatted correctly)                          text/html        (error message)
403 Forbidden (the user does not have the right permission)        text/html        (error message)
409 Conflict (all nodes already exist with these identifiers)      text/html        (error message)
```
> In case of a successful multiple node creation, the returned json is a list of nodes ordered using the same order as the provided input.

## read
Retrieve the specified nodes

HTTP Requests
* `GET` `/api/read/id1,id2`
* `POST` `/api/read/` `application/json` node identifier or array of node identifiers

HTTP response status codes
```
200 OK (nodes retrieved)                                    application/json (node identifier or array of node identifiers)
207 Multi-Status (some nodes do not exist)                  application/json (array of node identifiers and null)
400 Bad request (not formatted correctly)                   text/html        (error message)
403 Forbidden (the user does not have the right permission) text/html        (error message)
404 Not Found (all the nodes do not exist)                  text/html        (error message)
```

> The POST method is used in order to bypass the limits of the size of the URL (80KB for NodeJS). The GET method remains.

## update
Update existing nodes

HTTP Requests
* `PUT` `/api/update/` `application/json` node or array of nodes

HTTP response status codes
```
200 OK (nodes updated)                                      `application/json` (object or array of objects)
207 Multi-Status (some nodes do not exist)                  `application/json` (array of objects or nulls)
400 Bad Request (not formatted correctly)                   `text/html`        (error message)
403 Forbidden (the user does not have the right permission) `text/html`        (error message)
404 Not Found (every nodes do not exist)                    `text/html`        (error message)
```
> The input accepts arrays for _id keys to perform updates of the same kind on multiple nodes. Unspecified keys will be unchanged in the database. A key with null value deletes the key.

## delete
Delete nodes

HTTP Requests
* `DELETE` `/api/ids` `application/json` node identifier or array of node identifiers

HTTP response status codes
```
200 OK (nodes deleted or not found)        application/json (deleted node identifier or array of identifiers)
207 Multi-Status (some nodes do not exist) application/json (array of deleted nodes identifiers or null)
400 Bad request (not formatted correctly)  text/html        (error message)
404 Not Found (all the nodes do not exist) text/html        (error message)
```

## search_one
* Request `GET` `/api/search_one/`query
* Response `200` `application/json` node or null
* Response `400` `409` `text/html` error message

## search_mongo
* Request `POST` `/api/search_mongo` `application/json` `query` `sort` `limit` `skip`
* Response `200` `application/json` array of string identifiers
* Response `409` `text/html` error message

## signIn
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

## Tests results

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
