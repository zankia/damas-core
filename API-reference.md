Please see the [Scripting](Scripting) page to setup a scripting environment for Python or Javascript.

> Since version 2.3, edges (links between nodes) are considered nodes, with the special attributes `src_id` and `tgt_id` referring the `_id` of other nodes.
> The API supports JSON exchanges over HTTP(S).

> The implementations of the API use the native data types: nodes are Python dictionaries, or JavaScript objects.
> Python uses `None`, JavaScript uses `null`.

> In Python, all requests are made synchronously, and the API methods do not support callbacks.
> In JavaScript, all requests are made synchronously, unless an optional callback function is provided. If so, the request is ran synchronously and its response is sent to the callback when available.

## Table of contents

[**CRUD methods**](#crud-methods)
- [`create`](#apicreate)
- [`read`](#apiread)
- [`update`](#apiupdate)
- [`delete`](#apidelete)

[**Search queries**](#search-queries)
- `ancestors` *
- [`graph`](#apigraph)
- [`search`](#apisearch)
- [`search_mongo`](#apisearch_mongo)

[**Asset management**](#asset-management)
- [`lock`](#apilock)
- [`unlock`](#apiunlock)
- [`version`](#apiversion)
- [`link`](#apilink)
- `variation` *
- `reference` *
- `write` *

[**Authentication**](#authentication)
- [`signIn`](#apisignIn)
- [`signOut`](#apisignOut)
- [`verify`](#apiverify)

\* *Not implemented yet in NodeJS*


# CRUD methods

These are the low-level methods to handle the generic nodes and edges entities and their attributes. The nodes and edges are identified by unique identifiers, stored in the reserved `_id` key.

### /api/create

Create node(s) in the database.
Nodes have an `_id` key being their unique identifier in the database. This key can be overwritten at the moment of node creation, but can't be updated afterwards without first deleting the node.
The server may add some other arbitrary keys.

* __`create(nodes, [callback])`__

__Arguments__

* `node` an object or array of objects to insert in the database
* `callback` (_js only_) if specified, the request is asynchronous

__Return values__:
* A unique node or an array of nodes (depending on the input) on success
* `null` or `None` on failure

__HTTP Implementation__
* Method: `POST`
* URI: `/api/create/`
* Content-Type: `application/json`
* Reponses:
    * `201` `application/json` OK (created node(s))
    * `207` `application/json` Multi-Status (some nodes were conflictuous, the others are created)
    * `400` `text/html` Bad Request (not formatted correctly)
    * `409` `text/html` Conflict (no node was created, probably due to an `_id` conflict)

```python
# create a new node
>>> project.create({"key1":"value1"})
{'key1': 'value1', 'time': 1437469470133, '_id': '55ae0b1ed81e88357d77d0e9', 'author': 'demo'}

# create a new edge
>>> project.create({"src_id":"55ae0b1ed81e88357d77d0e9","tgt_id":"560061f2d4cb24441ed88aa4"})
```

```js
var node1, node2;
// synchronous request
node1 = damas.create({key1: "value1"});
// asynchronous request
damas.create({key1: "value2"}, function (node) {
    node2 = node;
});
```


## /api/read

Retrieve the keys of one or many nodes indexes.

__read( `ids`, [`callback`] )__
* `ids` a node index as string (for a unique index), or an array of string indexes
* `callback` _(optional)_ (_js only_) function to call after asynchronous read. If callback is undefined, a synchronous read is performed.
* Returns a JSON node, a node list or undefined.

> The resulting array is sorted in the same order as the input array of indexes.

```js
// Javascript
var ids=[id1,id2];
// Get one node
var node = damas.read("55ae0b1ed81e88357d77d0e9");

// Get a group of nodes
var nodes = damas.read(["55ae0b1ed81e88357d77d0e9", "560061f2d4cb24441ed88aa4"]);
```

In Python the `id` argument can be a list, a tuple or a set

__HTTP Implementation__
* Method `GET`
* URI `/api/read/`ids
* HTTP Response status code `200` `application/json` OK (node or array of nodes)
* HTTP Response status code `400` `text/html` Bad Request (not formatted correctly)
* HTTP Response status code `404` `text/html` Not Found (the nodes do not exists)

## /api/update
Modify the keys on the specified node(s).

__update( `ids`, `keys`, [`callback`] )__

* `ids` a node index as string (for a unique index), or an array of string indexes
* `keys` key:value pairs
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* Returns the modified nodes on success, false otherwise

> The specified keys overwrite existing keys, others are left untouched. A null value removes the key.

> The resulting array is sorted in the same order as the input array of indexes.

```js
// Javascript
// Create a set of keys for our node
var keys = {name:'test2',newKey:'name'};

// Update the node id with this set of keys
var node = damas.update(id, keys);
```

In __Python__, indexes can be specified as a string (for a unique index) or a Python list. The None value is used to remove a key.

```py
# Python
# We create 2 nodes...
project.create({'a':'a', 'b':'b'})
# {u'a': u'a', u'_id': u'56017b3053f58ea107dea5f7', u'b': u'b', u'time': 1442937648390, u'author': u'demo'}
project.create({'a':'a', 'b':'b'})
# {u'a': u'a', u'_id': u'56017b3853f58ea107dea5f8', u'b': u'b', u'time': 1442937656258, u'author': u'demo'}

# Then we modify the 'a' key and remove the 'b' key on both nodes in one query
project.update(['56017b3053f58ea107dea5f7', '56017b3853f58ea107dea5f8'], {'a':'A', 'b':None})
# [{u'a': u'A', u'_id': u'56017b3053f58ea107dea5f7', u'time': 1442937648390, u'author': u'demo'}, {u'a': u'A', u'_id': u'56017b3853f58ea107dea5f8', u'time': 1442937656258, u'author': u'demo'}]
```

__HTTP Implementation__
* Method `PUT`
* URI `/api/update`
* HTTP Response status code `200` `application/json` OK (updated node or array of updated nodes)
* HTTP Response status code `400` `text/html` Bad Request (not formatted correctly)
* HTTP Response status code `403` `text/html` Forbidden (the user does not have the right permission)
* HTTP Response status code `404` `text/html` Not Found (the nodes do not exist)

## /api/delete
Recursively delete the specified node

__delete( `ids`, [`callback`] )__

* `ids` a node index as string (for a unique index), or an array of string indexes
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* Returns true on success, false otherwise

```js
// Javascript
damas.delete(id);
```

##### HTTP Request `DELETE` `/api/ids`
##### HTTP Response `200` `text/html` message
##### HTTP Response `409` `text/html` error message


# Search Queries

## /api/search
Find elements wearing the specified key(s) using a query string
* @param {String} search query string
* @param {function} [callback] - Function to call, boolean argument
* @returns {Array} array of element indexes or null if no element found

```js
// Javascript
var matches = damas.search('file:/rabbit/ type:char');
```

### search string format:

* (keyname)(operator)(value)
* operators list: `:`, `<`, `<=`, `>`, `>=`
* in case of `:` operator, you can use a regular expression as value:

> "file:/floor.*png/i"

will list every png file containing "floor" in the file name, case insensitive

## /api/search_one
Search nodes, returning the first matching occurrence as a node object (not as index as in search). The search string format is the same as for the search method.
* @param {String} search query string
* @param {function} [callback] - Function to call, boolean argument
* @returns {Array} array of element indexes or null if no element found

__HTTP Implementation__
* Method: `GET`
* URI: `/api/search_one/`query
* Response: `200` `application/json` node or null
* Response: `400` `409` `text/html` error message

## /api/search_mongo

We expose the MongoDB find and cursor methods here in order to provide a powerful search with many options. It is only available when the server runs a MongoDB database to store the data.

__damas.search_mongo(`query`, [`sort`, `limit`, `skip`, `callback`])__

* `query` the query object https://docs.mongodb.org/v3.0/reference/method/db.collection.find/
* `sort` _(optional)_ https://docs.mongodb.org/v3.0/reference/method/cursor.sort/
* `limit` _(optional)_ https://docs.mongodb.org/v3.0/reference/method/cursor.limit/
* `skip` _(optional)_ https://docs.mongodb.org/v3.0/reference/method/cursor.skip/
* `callback` _(optional)_ _(js only)_ function to call to perform an asynchronous search. If undefined, a synchronous read is performed.
* returns arrays of matching indexes

> In order to use regular expressions, and because the JSON format only accept strings and has no type for regular expressions, we use strings with the prefix REGEX_ to indicate to the server that it must convert it to a RegExp object before executing the Mongo query.

    For example: the /.*/ regular expression.

    is written "REGEX_.*" as string format in the JSON messages

```py
# Python
# get the 10 most recent files (having the higher `time` key on nodes)
>> project.search_mongo({"file":{"$exists": True}}, {"time":-1}, 10, 0)
[u'56701f266899505c6d82ffc4', u'56701e2583cfa5c16c1a2f78', u'56701b791da266d26bc11126', u'56701cf1570a32f16be5bb60', u'56701923a26510e96969e277', u'5670305b40c1a51070f3356f', u'567026b69b2d56016f663242', u'56702671a86238e76e08f600', u'56701fb92fdef89f6dcb8c6c', u'55b36829cc6742a30da59b98']
```

```js
// Javascript
// get the 200 last indexed files, sorted by descending time key, and display a table in html format as output
damas.search_mongo({'time': {$exists:true}}, {"time":-1},200,0, function(res){
    damas.read(res, function(assets){
        var out = document.querySelector('#contents');
        var str = '<table><tr><th>author</th><th>file</th><th>time &xutri;</th><th>comment</th></tr>';
        for(var i=0; i<assets.length; i++)
        {
            str +=  '<tr>';
            str +=  '<td>'+assets[i].author+'</td>';
            str +=  '<td>'+assets[i].file+'</td>';
            str +=  '<td>'+new Date(parseInt(assets[i].time))+'</td>';
            str +=  '<td style="white-space:normal">'+assets[i].comment+'</td>';
            str +=  '</tr>';
        }
        str += '</table>';
        out.innerHTML = str;
    });
});
```

##### HTTP `POST` `/api/search_mongo` `application/json` `query` `sort` `limit` `skip`
##### HTTP Response `200` `application/json` array of string indexes
##### HTTP Response `409` `text/html` error message


## /api/graph
Recursively get all source nodes and edges connected to the specified node
* @param {String} id - Node indexes
* @param {function} [callback] - Function to call, array argument
* @returns {Array} array of element indexes

```js
// Javascript
// This will return an array containing nodes (links are nodes too)
var sources = damas.graph("55687e68e040af7047ee1a53");
```


# Asset management

## /api/lock
Lock the asset for edition, for the current user.

__lock( `id`, [`callback`] )__

* `id` asset node index string
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode accepting a boolean argument
* Returns true on success, false otherwise

> Sets a `lock` key on the node, with the authenticated username as value. If the asset is already locked, it will return false.

## /api/unlock
Unlock a locked asset.

__unlock( `id`, [`callback`] )__

* `id` asset node index string
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode accepting a boolean argument
* Returns true on success, false otherwise

> If the asset is not locked or locked for someone else (`lock` key value != authenticated user name) it returns false. If it was successfully unlocked, returns true.

## /api/version
Insert a new file as a new version of an existing asset, wearing the specified keys.

__version( `id`, `keys`, [`callback`] )__

* `id` asset node index string
* `keys` key:value pairs
    * `file` path string to the new version file
    * [`comment`] _(optional)_ a text message to comment the version 
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* Returns the new node on success, null otherwise

> The key `keys.file` must exist, else the server returns an error. It contains the path to the new version file

```py
# Python
>>> project.version("5601542f690375ccae0c1a3b",{"comment":"added requested elements and cleaned", "file":"/project/files/scene-150925121320.ma"})
{u'comment': u'added requested elements and cleaned', u'author': u'demo', u'#parent': u'5601542f690375ccae0c1a3b', u'file': "/project/files/scene-150925121320.ma", u'time': 1443174266343, u'_id': u'5605177ad8b454a87e771b65'}
```

##### HTTP Request `POST` `/api/version/id` `application/json`
##### HTTP Response `200` `400` `401` `application/json`

## /api/link
Create edges from the sources files to the target file wearing the specified keys. The sources and the target are specified as pathes to the corresponding files.

__link( `target`, `sources`, `keys`, [`callback`] )__

```py
# Python
project.link("/bbb/production/chars/bird.blend",["/bbb/production/chars/textures/butterflywings.png","/bbb/production/chars/textures/bird_eye.png"],{"link_type":"texture"})
```

##### HTTP Request `POST` `/api/link` `application/json`
##### HTTP Response `200` `400` `401` `application/json`

<!--
## Trees, based on a #parent key

- damas.ancestors( id )
- damas.children( id )
- damas.move( id, target )

## Version control

### damas.backup( id )
Copy the current version to backup folder, preserving mtime
* @param {Integer} $id the asset

### damas.increment( id )
Increment the asset after a successful backup and commit sequence
* @param {String} asset node index
* @param {String} user message for the new version

### damas.upload( files )
Process the file upload
* @param {String} $id the asset
* @param {String} $path the path of the uploaded file in the temporary folder
* @param {String} $message
* @returns {Boolean} true on success, false otherwise

-->

# Authentication

Please refer to the dedicated [Authentication](Authentication) page to have more details about how the implemented JSON web token based authentication works.

## /api/signIn
Sign in using the server embeded authentication system

__signIn( username, password, [callback])__

* `username` string
* `password` the user secret password string
* `callback` (js_only, optional) function to call for asynchronous mode
* returns the authenticated user node on success, false otherwise

##### HTTP Request `POST` `/api/signIn` `application/x-www-form-urlencoded` `username` `password`
##### HTTP Response `200` `application/json`
##### HTTP Response `401`

## /api/signOut
* @param {function} [callback] - Function to call, accepting a boolean argument
* @return true on success, false otherwise

##### HTTP Request
##### HTTP Response

## /api/verify
Check if the authentication is valid
* @param {function} [callback] - Function to call, accepting a boolean argument
* @return true on success, false otherwise

##### HTTP Request `GET` `/api/verify`
##### HTTP Response `200` `application/json`
##### HTTP Response `401`
