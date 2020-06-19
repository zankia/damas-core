The communication protocol used by damas-core clients and servers is based on [JSON data-interchange format](http://json.org) over [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).

## Set of operations

|PATH|METHOD|PARAMS|RESPONSE STATUS CODE|
|---|-----|--|-|
| CRUD ||
| [/api/create/](#create)             | POST      | JSON       | 201, 207, 400, 403, 409, 500 |
| [/api/read/](#read)                 | GET, POST | URL, JSON  | 200, 207, 400, 403, 404, 500 |
| [/api/update/](#update)             | PUT       | JSON       | 200, 207, 400, 403, 404, 500 |
| [/api/upsert/](#upsert)             | POST      | JSON       | 200, 400, 403, 500 |
| [/api/delete/](#delete)             | DELETE    | JSON       | 200, 207, 400, 404, 500 |
| AUTH ||
| [/api/signIn/](#signIn)             | POST      | FORM       | 200, 401, 404 |
| [/api/verify/](#verify)             | GET       | -          | 200, 401 |
| SEARCH ||
| [/api/graph/](#graph)               | GET       | URL        | 200, 207, 400, 404, 500 |
| [/api/search/](#search)             | GET       | URL        | 200, 400, 500 |
| [/api/search_one/](#search_one)     | GET       | URL        | 200, 400, 500 |
| [/api/search_mongo/](#search_mongo) | POST      | JSON       | 200, 500, 501 |

## Details
### create
Insert new elements

#### HTTP Requests
* `POST` `/api/create/` `application/json` object or array of objects

#### HTTP Responses
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


### read
Retrieve object(s) by identifier(s). In addition to the GET method, a POST method is provided to avoid the limitation of the URL length.

#### HTTP Requests
* `GET` `/api/read/id1,id2`
* `POST` `/api/read/` `application/json` identifier string or array of identifier strings

#### HTTP Responses
```http
200 OK                    application/json (objects or array of objects) requested object(s)
207 Multi-Status          application/json (array of objects and null) some objects do not exist
400 Bad Request           text/html (error message) not formatted correctly
403 Forbidden             text/html (error message) the user does not have the right permission
404 Not Found             text/html (error message) object(s) do not exist
500 Internal Server Error text/html (error message) error while accessing the database
```

> The HTTP headers are often limited by HTTP servers to a maximum size. NodeJS maximum header size is 80KB. The POST method is provided to avoid this limitation in order to read any number of identifiers.

### update
Modify existing object(s)

#### HTTP Requests
* `PUT` `/api/update/` `application/json` object or array of objects

#### HTTP Responses
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

### upsert
Create or modify existing objects

#### HTTP Requests
* `POST` `/api/upsert/` `application/json` object or array of objects

#### HTTP Responses
```http
200 OK                    application/json (object or array of objects) updated/created object(s)
400 Bad Request           text/html (error message) not formatted correctly
403 Forbidden             text/html (error message) the user does not have the right permission
500 Internal Server Error text/html (error message) error while accessing the database
```
> The input accepts arrays for _id keys, as well as values "null".

### delete
Permanently remove objects from the database

#### HTTP Requests
* `DELETE` `/api/delete/` `application/json` identifier string or array of identifier strings

#### HTTP Responses
```http
200 OK                    application/json (string or array of strings) deleted identifier(s)
207 Multi-Status          application/json (array of strings or null) some objects do not exist
400 Bad Request           text/html (error message) not formatted correctly
404 Not Found             text/html (error message) object(s) do not exist
500 Internal Server Error text/html (error message) could not access the database
```

### graph
#### HTTP Requests
#### HTTP Responses

### search
#### HTTP Requests
#### HTTP Responses

### search_one

#### HTTP Requests
* `GET` `/api/search_one/` `query`

#### HTTP Responses
```http
200 OK            application/json        (object or null)
400 Bad Request   text/html error message
409 Conflict      text/html error message
```

### search_mongo
#### HTTP Requests
* `POST` `/api/search_mongo` `application/json` `query` `sort` `limit` `skip`
#### HTTP Responses
```http
200 OK        application/json         (array of string identifiers)
409 Conflict  text/html error message
```

### signIn
Request a token from the sever

#### HTTP Requests
* `POST` `/api/signIn/` `application/x-www-form-urlencoded` `username` `password`

#### HTTP Responses
```http
200 Ok             application/json        (object)
401 Unauthorized   text/html error message
404 Not Found      text/html error message
```
> `404` error code is return if no authentication is required.

### verify
Check if the user has a token

#### HTTP Requests
* `GET` `/api/verify/`

#### HTTP Responses
```http
200 OK             application/json  (the authenticated user object)
401 Unauthorized   text/html error message
```