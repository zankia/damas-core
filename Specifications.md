# Table of Contents
* [Protocol Specifications](#protocol-specifications)
* [Drafts](#protocol-specifications-drafts)

# Protocol Specifications
The communication protocol is built over HTTP. This chapter describes the service operations, the possible responses and error codes to built consistent and compatible implementations of damas clients and servers.

|METHOD|PATH|
|-----|---|
|| CRUDS |
| POST | [/api/create/](#create) |
| DELETE | [/api/delete/](#delete) |
| GET, POST | [/api/read/](#read) |
| GET | [/api/search/](#search) |
| POST | [/api/search_mongo/](#search_mongo) |
| PUT | [/api/update/](#update) |
| POST | [/api/upsert/](#upsert) |
|| DAM |
| POST | [/api/comment/](#comment) |
| PUT | [/api/lock/](#lock) |
| POST | [/api/publish/](#publish) |
| PUT | [/api/unlock/](#unlock) |
|| AUTH |
| POST | [/api/signIn/](#signIn) |
| POST | [/api/signOut/](#signOut) |
| GET | [/api/verify/](#verify) |

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
Retrieve the node(s) specified by identifier(s). POST method is available to avoid limitation of URL length.

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

## upsert
Updates existing nodes and/or creates new nodes

HTTP Requests
* `POST` `/api/upsert/` `application/json` node or array of nodes

HTTP response status codes
```
200 OK (nodes updated)                                      `application/json` (object or array of objects)
400 Bad Request (not formatted correctly)                   `text/html`        (error message)
403 Forbidden (the user does not have the right permission) `text/html`        (error message)
```
> The input accepts arrays for _id keys, as well as values "null".

## delete
Delete nodes

HTTP Requests
* `DELETE` `/api/delete/` `application/json` node identifier or array of node identifiers

HTTP response status codes
```
200 OK (nodes deleted or not found)        application/json (deleted node identifier or array of identifiers)
207 Multi-Status (some nodes do not exist) application/json (array of deleted nodes identifiers or null)
400 Bad request (not formatted correctly)  text/html        (error message)
404 Not Found (all the nodes do not exist) text/html        (error message)
```

## comment
Create new node for each existing node. The new node represents the comment that is assigned to an asset or several assets. (one child node per existing node)

HTTP Requests
* `POST` `/api/comment/` `application/json` object

HTTP response status codes
```
201 OK (nodes created)                                      application/json    (object)
207 Multi-Status (some nodes don't exist)                   application/json    (array of objects)
400 Bad request (not formatted correctly)                   text/html           (error message)
403 Forbidden (the user does not have the right permission) text/html           (error message)
404 Not Found (the nodes do not exist)                      text/html           (error message)
```

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

## search
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

## verify
* Request `GET` `/api/verify/`
* Response `200` `application/json` the authenticated user object
* Response `401`

## lock
HTTP Requests
* `PUT` `/api/lock/` `application/json` node identifier or array of node identifiers

## unlock
HTTP Requests
* `PUT` `/api/unlock/` `application/json` node identifier or array of node identifiers

# Protocol Specifications Drafts

## version
* Request `POST` `/api/version/id` `application/json`
* Response `200` `400` `401` `application/json`

## link
* Request `POST` `/api/link` `application/json`
* Response `200` `400` `401` `application/json`

## search_one
* Request `GET` `/api/search_one/`query
* Response `200` `application/json` node or null
* Response `400` `409` `text/html` error message