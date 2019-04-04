The communication protocol used by damas-core clients and servers is based on [JSON data-interchange format](http://json.org) over [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).

|PATH|METHOD|RESPONSE STATUS CODE|
|---|-----|---|
| CRUD ||
| [/api/create/](#create) | POST | 201, 207, 400, 403, 409, 500 |
| [/api/read/](#read) | GET, POST | 200, 207, 400, 403, 404, 500 |
| [/api/update/](#update) | PUT | 200, 207, 400, 403, 404, 500 |
| [/api/upsert/](#upsert) | POST | 200, 400, 403, 500 |
| [/api/delete/](#delete) | DELETE | 200, 207, 400, 404, 500 |
| DAM ||
| [/api/comment/](#comment) | POST |
| [/api/lock/](#lock) | PUT |
| [/api/publish/](#publish) | POST |
| [/api/unlock/](#unlock) | PUT |
| AUTH ||
| [/api/signIn/](#signIn) | POST |
| [/api/signOut/](#signOut) | POST |
| [/api/verify/](#verify) | GET |
| SEARCH ||
| [/api/graph/](#graph) | GET | 200, 207, 400, 404, 500 |
| [/api/search/](#search) | GET | 200, 400, 500 |
| [/api/search_one/](#search_one) | GET | 200, 400, 500 |
| [/api/search_mongo/](#search_mongo) | POST | 200, 500, 501 |

## create
Insert new elements

### HTTP Requests
* `POST` `/api/create/` `application/json` object or array of objects

### HTTP Responses
```http
201 Created               application/json (object or array of objects) created object(s)        
207 Multi-Status          application/json (array of objects and null) some objects already exist
400 Bad Request           text/html (error message) not formatted correctly
403 Forbidden             text/html (error message) the user does not have the right permission
409 Conflict              text/html (error message) all objects already exist with these identifiers
500 Internal Server Error text/html (error message) error while accessing the database
```
> The _id key is used as unique object identifier string. If it is not provided in input, it will be set with a unique default identifier.

> In case of a multiple object creation, the returned json is an array of objects ordered using the same order as the input array.

> 207 Multi-Status happens when some specified identifiers already exist. A null value is returned in the array at corresponding position


## read
Retrieve object(s) by identifier(s). In addition to the GET method, a POST method is provided to avoid the limitation of the URL length.

### HTTP Requests
* `GET` `/api/read/id1,id2`
* `POST` `/api/read/` `application/json` node identifier or array of node identifiers

### HTTP Responses
```http
200 OK                    application/json (objects or array of objects) requested object(s)
207 Multi-Status          application/json (array of objects and null) some objects do not exist
400 Bad request           text/html (error message) not formatted correctly
403 Forbidden             text/html (error message) the user does not have the right permission
404 Not Found             text/html (error message) object(s) do not exist
500 Internal Server Error text/html (error message) error while accessing the database
```

> The HTTP headers are often limited by HTTP servers to a maximum size. NodeJS maximum header size is 80KB. The POST method is provided to avoid this limitation in order to read any number of identifiers.

## update
Modify existing object(s)

### HTTP Requests
* `PUT` `/api/update/` `application/json` node or array of nodes

### HTTP Responses
```http
200 OK                    application/json (object or array of objects) updated object(s)
207 Multi-Status          application/json (array of objects or nulls) some objects do not exist
400 Bad Request           text/html (error message) not formatted correctly
403 Forbidden             text/html (error message) the user does not have the right permission
404 Not Found             text/html (error message) object(s) do not exist
500 Internal Server Error text/html (error message) error while accessing the database
```

> The specified keys overwrite the existing keys on the server. Unspecified keys are left untouched on the server. A null value removes the key.

> The input accepts arrays for _id keys to perform updates of the same kind on multiple objects.

## upsert
Create or modify existing objects

### HTTP Requests
* `POST` `/api/upsert/` `application/json` object or array of objects

### HTTP Responses
```http
200 OK                    application/json (object or array of objects) updated/created object(s)
400 Bad Request           text/html (error message) not formatted correctly
403 Forbidden             text/html (error message) the user does not have the right permission
500 Internal Server Error text/html (error message) error while accessing the database
```
> The input accepts arrays for _id keys, as well as values "null".

## delete
Permanently remove objects from the database

### HTTP Requests
* `DELETE` `/api/delete/` `application/json` object identifier or array of node identifiers

### HTTP Responses
```http
200 OK                    application/json (string or array of strings) deleted identifier(s)
207 Multi-Status          application/json (array of strings or null) some objects do not exist
400 Bad request           text/html (error message) not formatted correctly
404 Not Found             text/html (error message) object(s) do not exist
500 Internal Server Error text/html (error message) could not access the database
```

## comment
Add comments to object(s)

### HTTP Requests
* `POST` `/api/comment/` `application/json` object

### HTTP Responses
```http
201 OK (object(s) created)                                  application/json    (object or array of objects)
207 Multi-Status (some objects don't exist)                 application/json    (array of objects)
400 Bad request (not formatted correctly)                   text/html           (error message)
403 Forbidden (the user does not have the right permission) text/html           (error message)
404 Not Found (object(s) do not exist)                      text/html           (error message)
```

## publish
Insert new objects. Similar to the generic create operation but accessible to the user class, and also performs some verifications of the keys provided as argument.

### HTTP Requests
* `POST` `/api/publish/` `application/json` object or array of objects

### HTTP Responses
```http
201 OK (object(s) created)                                           application/json (object or array of objects)
207 Multi-Status (some objects already exist with these identifiers) application/json (array of objects or null)
400 Bad Request (not formatted correctly)                            text/html        (error message)
403 Forbidden (the user does not have the right permission)          text/html        (error message)
409 Conflict (all objects already exist with these identifiers)      text/html        (error message)
```
## graph
### HTTP Requests
### HTTP Responses
## search
### HTTP Requests
### HTTP Responses
## search_one
### HTTP Requests
* `GET` `/api/search_one/`query
### HTTP Responses
* Response `200` `application/json` node or null
* Response `400` `409` `text/html` error message

## search_mongo
### HTTP Requests
* Request `POST` `/api/search_mongo` `application/json` `query` `sort` `limit` `skip`
### HTTP Responses
* Response `200` `application/json` array of string identifiers
* Response `409` `text/html` error message

## signIn
### HTTP Requests
* Request `POST` `/api/signIn/` `application/x-www-form-urlencoded` `username` `password`
### HTTP Responses
* Response `200` `application/json` user object
* Response `401` `text/html` error message

## signOut
### HTTP Requests
### HTTP Responses
* Request `/api/signOut/`
* Response

## verify
### HTTP Requests
### HTTP Responses
* Request `GET` `/api/verify/`
* Response `200` `application/json` the authenticated user object
* Response `401`

## lock
### HTTP Requests
* `PUT` `/api/lock/` `application/json` node identifier or array of node identifiers
### HTTP Requests
### HTTP Responses
## unlock
### HTTP Requests
* `PUT` `/api/unlock/` `application/json` node identifier or array of node identifiers
### HTTP Requests
### HTTP Responses
# Protocol Specifications Drafts

## version
* Request `POST` `/api/version/id` `application/json`
* Response `200` `400` `401` `application/json`

## link
* Request `POST` `/api/link` `application/json`
* Response `200` `400` `401` `application/json`