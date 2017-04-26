The damas-core API is implemented as modules for Python and Javascript programming languages. Please read the [[Client Setup]] guide to setup a scripting environment.

## Notes about the API

Types
> The client modules use the native language data types: Python nodes are returned as dictionaries or JavaScript objects according to the language used. Python `None`, `True`, `False`, are equivalent to JavaScript `null`, `true`, `false`, and are translated to/from JSON to communicate with the server.

Sync / Async
> The JavaScript API supports both synchronous and asynchronous requests. If the optional callback is provided as argument to the API calls, the request is ran asynchronously and the response is given as an argument to the specified callback. If the callback is not provided, the request is made synchronously and the return value holds the response. The Python API uses synchronous requests (a bit of work is required to make them async ready). 

Graphs
> Since version 2.3, edges (the directed links between nodes) are also considered as nodes, with the special attributes `src_id` and `tgt_id` referring the `_id` of the other nodes to link.

Contributing
> The API implementations follow the specifications described in the [Contributing](Contributing) page to communicate with the server, that you could read if you would like have more details about the underlying architecture.

## Table of contents

[**Asset management**](#asset-management)
- [`lock`](#lock)
- [`publish`](#publish)
- [`unlock`](#unlock)
- [`comment`](#comment)

[**Authentication**](#authentication)
- [`signIn`](#signIn)
- [`signOut`](#signOut)
- [`verify`](#verify)

[**Generic CRUD**](#generic-crud)
- [`create`](#create)
- [`read`](#read)
- [`update`](#update)
- [`delete`](#delete)

[**Search queries**](#search-queries)
- `ancestors` *
- [`graph`](#graph)
- [`search`](#search)
- [`search_mongo`](#search_mongo)

<!--
- [`version`](#apiversion)
- [`link`](#apilink)
- `variation` *
- `reference` *
- `write` *
-->

\* *Not implemented yet in NodeJS*


# Asset management

The assets are described as JSON nodes where _id key (identifier) is the path of the file
```json
{
    "_id": "/project/path/to/file",
    "author": "username who published the file",
    "comment": "author text when published",
    "file_mtime": 1491503965000,
    "file_size": 21419055,
    "lock": "username who locked the file",
    "time": 1491692123000
}
```

## lock
Nominative lock on assets for the current user (sets `lock` key equals to authenticated username)

__lock( `ids`, [`callback`] )__

* `ids` a node identifier string (to lock one asset), or an array of identifiers
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode accepting a boolean argument
* returns true on success, false otherwise

> Sets a `lock` key on the node, with the authenticated username as value. If the asset is already locked, it will return false.

```py
# Python
# lock one asset
project.lock('/project/path/to/file')
# True

# lock multiple assets in 1 request
project.lock(['/project/path/to/file1', '/project/another_file_path'])
# True
```

## publish
Add files to the index

__publish( `nodes`, [`callback`] )__

* `nodes` an object or array of objects to insert in the database
* `callback` (_js only_) if specified, the request is asynchronous
* returns a unique node or an array of nodes (depending on the input) on success
* returns `null` (Javascript) or `None` (Python) on failure

> same specifications as /api/create, except that it is accessible to the user class or above, and that it is expecting specific keys.

```json
{
  "_id": "/project/path/to/new_file",
  "comment": "text",
  "origin": "sitename"
}
```

* key `_id` can be a string path, or an array of string paths
* key `origin` should be an alphanumerical name without space, for ease of use

optional keys (these keys are not mandatory but could ease multi sites configurations and version control):
* `file_mtime` Number (milliseconds since 1 Jan 1970 00:00)
* `file_size` Number (number of bytes)
* `version` Number

> In a multi-site environment, the `origin` and `_id` path are used to retrieve the file from the source server.


## unlock
Unlock a locked asset.

__unlock( `ids`, [`callback`] )__

* `ids` a node identifier string (to unlock one asset), or an array of identifiers
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode accepting a boolean argument
* Returns true on success, false otherwise

> If the asset is not locked or locked for someone else (`lock` key value != authenticated user name) it returns false. If it was successfully unlocked, returns true.

## comment
Add a comment to one or several asset(s).

__comment( `nodes`, [`callback`] )__

* `nodes` an object  or array of objects specifying the assets' id and the string comment
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* returns a unique node or an array of nodes on success
* `null` (Javascript) or `None` (Python) on failure

> Sets a key `author` on the node, with the authenticated username as value, as well as a key `time`. 

```python
# Python
#single parent id
>>> project.comment({"#parent" : "asset_id", "comment" : "text"})
{u'author' : u'username', u'time' : 1480588505449, u'#parent' : u'asset_id', u'comment' : u'text'}

#multiple parent ids
>>> project.comment({"#parent" : ["asset_id1", "asset_id2"], "comment" : "text"})
[{u'author' : u'username', u'time' : 1480588505449, u'#parent' : u'asset_id1', u'comment' : u'text'}, {u'author' : u'username', u'time' : 1480588505449, u'#parent' : u'asset_id2', u'comment' : u'text'}]
```
```js
// Javascript
damas.comment({'#parent' : "asset_id", comment : "text"});
>> Object { author: "damas", time: 1480588505449, '#parent': "asset_id", comment: "text" }

// comment using an asynchronous call
damas.comment({'#parent' : "asset_id", comment : "text"}, function (node) {
    // asynchronous mode
    console.log(node.time);
});
```

# Authentication

Please refer to the dedicated [Authentication](Authentication) page to have more details about how the implemented JSON web token based authentication works.

```json
{
    "class": "user",
    "email": "usermail@address.com",
    "fullname": "Firstname Lastname String",
    "password": "13d3a2a16c0cd2f7bf115d471999377e",
    "username": "userlogin",
}
```

## /api/signIn
Sign in using the server embeded authentication system

__signIn( `username`, `password`, [`callback`])__

* `username` string
* `password` the user secret password string
* `callback` (js_only, optional) function to call for asynchronous mode
* returns an object containing an authentication token on success, false otherwise

## /api/signOut
__signOut([`callback`])__
* `callback` (js_only, optional) function to call for asynchronous mode
* returns true on success, false otherwise

## /api/verify
Check if the authentication is valid
__verify([`callback`])__
* `callback` (js_only, optional) function to call for asynchronous mode
* returns true on success, false otherwise


# Generic CRUD

These are the low-level methods to handle the generic nodes and edges entities and their attributes. The nodes and edges are identified by unique identifiers, stored in the reserved `_id` key.

## create

Create node(s) in the database. Nodes have an `_id` key being their unique identifier in the database. This key can be specified during creation, but can't be updated afterwards without first deleting the node.
The server may add some other arbitrary keys (author, time)

__create(`nodes`, [`callback`])__

* `nodes` an object or array of objects to insert in the database
* `callback` (_js only_) if specified, the request is asynchronous
* returns a unique node or an array of nodes (depending on the input) on success
* returns `null` (Javascript) or `None` (Python) on failure

```python
# Python
# create a new node
>>> project.create({"key1":"value1"})
{u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}

# create an asset node
>>> project.create({"_id":"/project/folder/to/file", "additional_key":"value"})
{u'additional_key': u'value', u'_id': u'/project/folder/to/file', u'time': 1480586620449, u'author': u'demo'}

# create multiple nodes
>>> project.create([{"label":"node1"}, {"label":"node2"}])
[{u'_id': u'583ff5a747e759beb73bde32', u'time': 1480586663024, u'label': u'node1', u'author': u'demo'}, {u'_id': u'583ff5a747e759beb73bde33', u'time': 1480586663024, u'label': u'node2', u'author': u'demo'}]

# create a new edge
>>> project.create({"src_id":"/project/folder/to/file1","tgt_id":"/project/folder/to/file2"})
{u'tgt_id': u'/project/folder/to/file2', u'_id': u'583ff67647e759beb73bde34', u'time': 1480586870826, u'src_id': u'/project/folder/to/file1', u'author': u'demo'}
```

```js
// Javascript
// create a new node
damas.create({key1: "value1"});
>> Object { author: "damas", time: 1480588505449, key1: "value1", _id: "583ffcd947e759beb73bde39" }

// create a new node using an asynchronous call
damas.create({key1: "value2"}, function (node) {
    // asynchronous mode
    console.log(node.time);
});
```


## read

Retrieve one or more nodes given their identifiers.

__read(`ids`, [`callback`])__
* `ids` a string or array of strings containing the ids to read. In Python, can be a list, tuple or set.
* `callback` (_js only_) if specified, the request is asynchronous
* returns a unique node object or an array of nodes (depending on the input) on success
* returns `null` or `None` on failure

> For multiple mode, The resulting array is sorted in the same order as the input array of identifiers. If some identifiers are not found, the result array is filled with None / null values for that position.

```js
// read an asset node identified by its path
var node = damas.read("/project/folder/file");
// read 2 nodes using their unique identifiers
var nodes = damas.read(["55ae0b1ed81e88357d77d0e9", "560061f2d4cb24441ed88aa4"]);
```

## update
Modify the keys on the specified node(s).

__update( `ids`, `keys`, [`callback`] )__

* `ids` a node identifier string (to update one node), or an array of identifiers
* `keys` key:value pairs
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* returns the modified nodes on success, false otherwise

> The specified keys overwrite the existing keys on the server. Other, unspecified keys, are left untouched on the server. A null value removes the key.

> If multiple nodes are specified, the resulting array is sorted in the same order as the input array of identifiers.

```js
// Javascript
// Create a set of keys for our node
var keys = {name:'test2',newKey:'name'};

// Update the node id with this set of keys
var node = damas.update(id, keys);
```

In __Python__, identifiers can be specified as a string (for a unique index) or a Python list. The None value is used to remove a key.

```py
# Python
# We create 2 nodes...
project.create({'a':'a', 'b':'b'})
# {u'a': u'a', u'_id': u'56017b3053f58ea107dea5f7', u'b': u'b', u'time': 1442937648390, u'author': u'demo'}
project.create({'a':'a', 'b':'b'})
# {u'a': u'a', u'_id': u'56017b3853f58ea107dea5f8', u'b': u'b', u'time': 1442937656258, u'author': u'demo'}

# Then we modify the 'a' key and remove the 'b' key on both nodes using one query
project.update(['56017b3053f58ea107dea5f7', '56017b3853f58ea107dea5f8'], {'a':'A', 'b':None})
# [{u'a': u'A', u'_id': u'56017b3053f58ea107dea5f7', u'time': 1442937648390, u'author': u'demo'}, {u'a': u'A', u'_id': u'56017b3853f58ea107dea5f8', u'time': 1442937656258, u'author': u'demo'}]
```

## delete
Recursively delete the specified node

__delete( `ids`, [`callback`] )__

* `ids` a node index as string (for a unique index), or an array of string indexes
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* returns true on success, false otherwise

```js
// Javascript
damas.delete(id);
```

# Search Queries

## search
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

## search_one
Search nodes, returning the first matching occurrence as a node object (not as index as in search). The search string format is the same as for the search method.
* @param {String} search query string
* @param {function} [callback] - Function to call, boolean argument
* @returns {Array} array of element indexes or null if no element found

## search_mongo

We expose the MongoDB find and cursor methods here in order to provide a powerful search with many options. It is only available when the server runs a MongoDB database to store the data.

__damas.search_mongo(`query`, [`sort`, `limit`, `skip`, `callback`])__

* `query` the query object https://docs.mongodb.org/v3.0/reference/method/db.collection.find/
* `sort` _(optional)_ https://docs.mongodb.org/v3.0/reference/method/cursor.sort/
* `limit` _(optional)_ https://docs.mongodb.org/v3.0/reference/method/cursor.limit/
* `skip` _(optional)_ https://docs.mongodb.org/v3.0/reference/method/cursor.skip/
* `callback` _(optional)_ _(js only)_ function to call to perform an asynchronous search. If undefined, a synchronous read is performed.
* returns arrays of matching indexes

> In order to use regular expressions, and because the JSON format only accept strings and has no type for regular expressions, we use strings with the prefix REGEX_ to indicate to the server that it must convert it to a RegExp object before executing the Mongo query. To add options to regular expressions, prefer the syntax RX_`expression`_RX`options`.

    For example: the /.*/ regular expression.

    is written "REGEX_.*" as string format in the JSON messages

    Example with case-insensitive option: /.*/i

    is written "RX_.*_RXi" as string format in the JSON messages

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

## graph
Recursively get all source nodes and edges connected to the specified node
* @param {String} id - Node indexes
* @param {function} [callback] - Function to call, array argument
* @returns {Array} array of element indexes

```js
// Javascript
// This will return an array containing nodes (links are nodes too)
var sources = damas.graph("55687e68e040af7047ee1a53");
```

<!--


## version
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

## link
Create edges from the sources files to the target file wearing the specified keys. The sources and the target are specified as pathes to the corresponding files.

__link( `target`, `sources`, `keys`, [`callback`] )__

```py
# Python
project.link("/bbb/production/chars/bird.blend",["/bbb/production/chars/textures/butterflywings.png","/bbb/production/chars/textures/bird_eye.png"],{"link_type":"texture"})
```

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

## upload
Process the file upload
* @param {String} $id the asset
* @param {String} $path the path of the uploaded file in the temporary folder
* @param {String} $message
* @returns {Boolean} true on success, false otherwise

-->