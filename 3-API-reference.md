The damas-core API is implemented as modules for Python and Javascript programming languages. You could read [[2 Getting Started]] to setup a scripting environment, or try the demo site https://demo.damas.io

Notes on types
> The client modules use the built-in types: Python expose elements as dictionaries and JavaScript expose elements as Objects. Python `None`, `True`, `False`, are equivalent to JavaScript `null`, `true`, `false`, and are translated to/from JSON to communicate with the server. Python lists, tuples or sets can be used as arrays.

Sync / Async
> The JavaScript API supports both synchronous and asynchronous requests. If the optional callback argument is provided, the request will run asynchronously and the response will be given as an argument to the specified callback. If the callback is not provided, the request is made synchronously and the return value holds the response. The Python API uses synchronous requests only (a bit of work is required to make them async ready). 

Graphs
> Since version 2.3, and in the NodeJS server, the edges (the directed links between nodes) are objects as nodes, wearing key/values, with the reserved keys `src_id` and `tgt_id` referring to the `_id` of the nodes to link.

Specifications
> The API implementations follow the specifications described in the [[Specifications| 4 Specifications]] page to communicate with the server, that you could read if you would like have more details about the underlying architecture.

## Table of contents

### Generic elements

The elements are identified using unique identifiers stored in the reserved `_id` key. If the `_id` key is not provided at creation, a default unique value for `_id` is assigned. The other properties are stored next to it as key/value pairs using the [JSON](https://json.org/) types.
```json
{
    "_id": "your_custom_id",
    "number": 1234,
    "string":"hello world",
    "boolean": true
}
```
A set of generic CRUD functions is provided to create, read, modify and delete elements:

- [`create`](#create) - insert new element(s)
- [`read`](#read) - retrieve element(s) using identifiers
- [`update`](#update) - modify existing element(s)
- [`upsert`](#upsert) - create or modify element(s)
- [`delete`](#delete) - delete element(s)

### File Management

The files are described as JSON objects where the _id key (identifier) is the path of the file using the UNIX path format with `/` slash character as sub level delimiter.
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
- [`lock`](#lock) - lock file(s) for edition
- [`publish`](#publish) - add file(s) to the index
- [`unlock`](#unlock) - unlock file(s)
- [`comment`](#comment) - add a comments to file(s)

### User Management
The users are described as elements wearing some reserved keys: `username`, `password`, `class` plus optional keys.
```json
{
    "class": "user",
    "email": "usermail@address.com",
    "fullname": "Firstname Lastname String",
    "password": "13d3a2a16c0cd2f7bf115d471999377e",
    "username": "userlogin"
}
```

The [Authentication](Authentication) page gives more details about the authentication mechanism.

- [`signIn`](#signIn)- request an authentication token from the server
- [`signOut`](#signOut) - revoke a token
- [`verify`](#verify) - ask the server for the authentication status and user

### Search queries

- [`graph`](#graph) - retrieve connected edges and nodes (recursive)
- [`search`](#search) - find elements matching a query string
- [`search_one`](#search_one) - find first element matching a query string
- [`search_mongo`](#search_mongo) - find elements using a MongoDB query object (if MongoDB is the back-end)

<!--
\* *Not implemented yet in NodeJS*
- `ancestors` *
- [`version`](#apiversion)
- [`link`](#apilink)
- `variation` *
- `reference` *
- `write` *
-->

## Functions list

### create
Create element(s) in the database. Elements have an `_id` key being their unique identifier in the database. This key can be specified during creation, but can't be updated afterwards without first deleting the element. The server may add some other arbitrary keys (like `author`, `time` at creation) depending on its configuration.
```js
create ( elements [, callback] )
```
#### parameters
* `elements` {object | array} : object(s) to insert in the database
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous

#### return values
* returns an object or an array of objects (depending on the input) on success
* returns `null` (Javascript) or `None` (Python) on failure

#### examples
```python
# Python
# create a new element
>>> damas.create({"key1":"value1"})
{u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}

# create a file element
>>> damas.create({"_id":"/project/folder/file", "additional_key":"value"})
{u'additional_key': u'value', u'_id': u'/project/folder/file', u'time': 1480586620449, u'author': u'demo'}

# create multiple elements
>>> damas.create([{"label":"element1"}, {"label":"element2"}])
[{u'_id': u'583ff5a747e759beb73bde32', u'time': 1480586663024, u'label': u'element1', u'author': u'demo'}, {u'_id': u'583ff5a747e759beb73bde33', u'time': 1480586663024, u'label': u'element2', u'author': u'demo'}]

# create a new edge element
>>> damas.create({"src_id":"/project/folder/file1","tgt_id":"/project/folder/file2"})
{u'tgt_id': u'/project/folder/to/file2', u'_id': u'583ff67647e759beb73bde34', u'time': 1480586870826, u'src_id': u'/project/folder/to/file1', u'author': u'demo'}
```
```js
// Javascript
// create a new element
damas.create({key1: "value1"});
▸ Object { author: "demo", time: 1437469470133, key1: "value1", _id: "55ae0b1ed81e88357d77d0e9" }

// create a new element using an asynchronous call
damas.create({key1: "value2"}, function (element) {
    console.log(element.time);
});

// create a file element
damas.create({"_id":"/project/folder/file", "additional_key":"value"});
▸ Object {additional_key: "value", _id: "/project/folder/file", time: 1480586620449, author: "demo"}

// create multiple elements
damas.create([{"label":"element1"}, {"label":"element2"}]);
▸ Array [{_id: "583ff5a747e759beb73bde32", time: 1480586663024, label: "element1", author: "demo"}, {_id: "583ff5a747e759beb73bde33", time: 1480586663024, label: "element2", author: "demo"}]

// create a new edge element
damas.create({"src_id":"/project/folder/file1","tgt_id":"/project/folder/file2"})
▸ Object {tgt_id: "/project/folder/to/file2", _id: "583ff67647e759beb73bde34", time: 1480586870826, src_id: "/project/folder/to/file1", author: "demo"}
```

### read
Retrieve one or more elements given their identifiers
```js
read ( identifiers [, callback] )
```
#### parameters
* `identifiers` {string | array} : identifier(s) string(s) to read
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns an object or an array of objects (depending on the input) on success
* returns `null` or `None` on failure

> For multiple mode, The resulting array is sorted in the same order as the input array of identifiers. If some identifiers are not found, the result array is filled with None / null values for that position.

#### examples
```python
# Python
# read a file
>>> damas.read("/project/folder/file")
{u'additional_key': u'value', u'_id': u'/project/folder/file', u'time': 1480586620449, u'author': u'demo'}

# read 2 elements
>>> damas.read(["583ff5a747e759beb73bde32","583ff5a747e759beb73bde33"])
[{u'_id': u'583ff5a747e759beb73bde32', u'time': 1480586663024, u'label': u'element1', u'author': u'demo'}, {u'_id': u'583ff5a747e759beb73bde33', u'time': 1480586663024, u'label': u'element2', u'author': u'demo'}]
```
```js
// Javascript
// read a file
damas.read("/project/folder/file");
▸ Object {additional_key: "value", _id: "/project/folder/file", time: 1480586620449, author: "demo"}

// read 2 elements
damas.read(["583ff5a747e759beb73bde32", "583ff5a747e759beb73bde33"]);
▸ Array [_id: "583ff5a747e759beb73bde32", time: 1480586663024, label: "element1", author: "demo"}, {_id: "583ff5a747e759beb73bde33", time: 1480586663024, label: "element2", author: "demo"}]
```

### update
Modify and remove keys of the specified element(s)
```js
update ( elements [, callback] )
```
#### parameters
* `elements` {object | array} : object(s) to update
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous

#### return values
* returns an object or an array of objects (depending on the input) on success
* returns `null` (`None` in Python) on failure
* returns an array of objects or null on mixed success/failures

> The specified keys overwrite the existing keys on the server. Unspecified keys are left untouched on the server. A `null` or `None` value removes the key.

> If multiple nodes are specified, the resulting array is sorted in the same order as the input array of identifiers.

> The `_id` key can accept an array of identifiers, which means that the update will be performed on each specified element

#### examples
```js
// Javascript
// update an element
damas.update({_id: "55ae0b1ed81e88357d77d0e9", key1: null, newkey: "value2"});
▸ Object { author: "demo", time: 1437469470133, newkey: "value2", _id: "55ae0b1ed81e88357d77d0e9" }

// update multiple elements
damas.update([{_id: "583ff5a747e759beb73bde32", "label":"elementA"}, {_id: "583ff5a747e759beb73bde33", "label":"elementB"}]);
▸ Array [{_id: "583ff5a747e759beb73bde32", time: 1480586663024, label: "elementA", author: "demo"}, {_id: "583ff5a747e759beb73bde33", time: 1480586663024, label: "elementB", author: "demo"}]

// update multiple elements, condensed
damas.update({_id: ["583ff5a747e759beb73bde32","583ff5a747e759beb73bde33"], "newkey":"value"});
▸ Array [{_id: "583ff5a747e759beb73bde32", time: 1480586663024, label: "elementA", author: "demo", newkey:"value"}, {_id: "583ff5a747e759beb73bde33", time: 1480586663024, label: "elementB", author: "demo", newkey:"value"}]
```

In __Python__, the None value is used to remove a key.

```py
# Python
# update an element
>>> damas.update({'_id': '55ae0b1ed81e88357d77d0e9', 'key1': None, 'newkey': 'value2'})
{u'newkey': u'value2', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}

# update multiple elements
damas.update([{'_id': '583ff5a747e759beb73bde32', 'label':'elementA'}, {'_id': '583ff5a747e759beb73bde33', 'label':'elementB'}])
[{u'_id': u'583ff5a747e759beb73bde32', u'time': 1480586663024, u'label': u'elementA', u'author': u'demo'}, {u'_id': u'583ff5a747e759beb73bde33', u'time': 1480586663024, u'label': u'elementB', u'author': u'demo'}]

# update multiple elements, condensed
damas.update({'_id': ['583ff5a747e759beb73bde32','583ff5a747e759beb73bde33'], 'newkey':'value'})
[{u'newkey': u'value', u'_id': u'583ff5a747e759beb73bde32', u'time': 1480586663024, u'label': u'elementA', u'author': u'demo'}, {u'newkey': u'value', u'_id': u'583ff5a747e759beb73bde33', u'time': 1480586663024, u'label': u'elementB', u'author': u'demo'}]
```

### upsert
Create or update element(s) when identifier(s) are specified and found
```js
upsert ( elements [, callback] )
```
#### parameters
* `elements` {object | array} : object(s) to insert and/or update in the database
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns an object or an array of objects (depending on the input) on success
* returns `null` (Javascript) or `None` (Python) on failure
#### examples
```python
# Python
# create a new node with a specified id
>>> project.upsert({"_id":"55ae0b1ed81e88357d77d0e9"})
{u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}

# update a node
>>> project.upsert([{"_id":"55ae0b1ed81e88357d77d0e9", "additional_key":"value"}])
{u'additional_key': u'value', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}

# create a new node without specifying id
>>> project.upsert({"_id":"null"})
{u'_id': u'57ae0b1ed81e88357d77d0b4', u'time': 1480586620449, u'author': u'demo'}

# create and update
>>> project.upsert([{"_id":["55ae0b1ed81e88357d77d0e9", "null"], "additional_key":"hello"}])
[{u'additional_key': u'hello', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}, {u'additional_key': u'hello', u'_id': u'56ae0b1ed81e88357d77d0f9', u'time': 1480586620449, u'author': u'demo'}]
```
```js
// Javascript
// create a new node
damas.upsert({_id: "null"});
>> Object { author: "damas", time: 1480588505449, _id: "583ffcd947e759beb73bde39" }

// update a node
damas.upsert({_id: "583ffcd947e759beb73bde39", a : "test"})
>> Object { a : "test", author: "damas", time: 1480588505449, _id: "583ffcd947e759beb73bde39" }

//create and update
damas.upsert({_id: ["583ffcd947e759beb73bde39", "null"], a : "damas"})
>> Object { a : "damas", author: "damas", time: 1480588505449, _id: "583ffcd947e759beb73bde39" }
>> Object { a : "damas", author: "damas", time: 1480588505449, _id: "583ffcd947e759beb73ple85" }

// create a new node using an asynchronous call
damas.upsert({key1: "value2"}, function (node) {
    // asynchronous mode
    console.log(node.time);
});
```

### delete
Permanently remove element(s) from the database
```js
delete ( identifiers [, callback] )
```
#### parameters
* `identifiers` {string | array} : identifier(s) to delete from the database
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns true on success, false otherwise
* returns a boolean or an array of booleans (depending on the input)

> the returned array is sorted as the input array
#### examples
```js
// Javascript
damas.delete("55ae0b1ed81e88357d77d0e9");
▸ true
```

### lock
Lock file(s) for edition. Sets a `lock` key on elements with current authenticated username as value)
```js
lock( identifiers [, callback] )
```
#### parameters
* `identifiers` {string  | array} : identifier(s) string to lock
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns true on success, false otherwise
* returns false if the element is already locked

```py
# Python
# lock one asset
project.lock('/project/path/to/file')
# True

# lock multiple assets in 1 request
project.lock(['/project/path/to/file1', '/project/another_file_path'])
# True
```

### publish
Add files to the index
```js
publish( elements [, callback] )
```
#### parameters
* `elements` {object | array} : object(s) to insert in the database
* `callback` {functon} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns an array of nodes (containing parent nodes and child nodes) on success
* returns `null` (Javascript) or `None` (Python) on failure

> Same specifications as /api/create, except that it is expecting specific keys and a child element is created to keep track of the states upon publish

#### examples
```json
{
  "_id": "/project/path/new_file",
  "comment": "text",
  "origin": "sitename"
}
```
Child node :
```json
{
  "_id": "55ae0b1ed81e88357d77d0e9",
  "#parent" : "/project/path/new_file",
  "comment": "text",
  "origin": "sitename"
}
```
* `_id` path or an array of paths
* key `origin` alphanumerical name without space, for ease of use. For multi-site.

optional keys (these keys are not mandatory but could ease multi sites configurations and version control):
* `file_mtime` Number (milliseconds since 1 Jan 1970 00:00)
* `file_size` Number (number of bytes)
* `version` Number

> In a multi-site environment, the `origin` and `_id` path are used to retrieve the file from the source server.

### unlock
Unlock a locked asset
```js
unlock ( identifiers [, callback] )
```
#### parameters
* `identifiers` {string | array} : identifier(s) string(s) to lock
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns a boolean or an array of booleans (depending on the input)

> If the asset is not locked or locked for someone else (`lock` key value != authenticated user name) it returns false. If it was successfully unlocked, returns true.

### comment
Add a comment to one or several element(s)
```js
comment ( elements [, callback] )
```
#### parameters
* `elements` {object | array} : object(s) specifying the elements identifiers and comment string
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns an element or an array of elements on success
* `null` (Javascript) or `None` (Python) on failure

> Sets `author` key on elements with the authenticated username as value, as well as `time` key with the current time at creation.

```python
# Python
# single parent id
>>> project.comment({"#parent" : "asset_id", "comment" : "text"})
{u'author' : u'username', u'time' : 1480588505449, u'#parent' : u'asset_id', u'comment' : u'text'}

# multiple parent ids
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

### signin
```js
signIn ( username, password [, expiresIn, callback] )
```
#### parameters
* `username` {string} : the username or email string
* `password` {string} : the user secret password string
* `expiresIn` {string} _(optional)_ : time before a new connection is required 
* `callback`  {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns an object containing an authentication token on success, false otherwise

Sign in using the server embedded authentication system

### signout
```js
signOut ( [callback] )
```
#### parameters
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns true on success, false otherwise

### verify
Ask the server for the authentication status and user
```js
verify ( [callback] )
```
#### parameters
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns the authenticated user element on success, false otherwise

### search
Find elements wearing the specified key(s) using a query string.
```js
search ( query [, callback] )
```
#### parameters
* `query` {string} : search query string
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns an array of matching identifiers or null if no match was found

* format: "keyname1:value keyname2:value"
* operators list: `:`, `<`, `<=`, `>`, `>=`

In case of `:` operator, you can use a regular expression as value.

#### examples
```python
# Python
# list every png file containing "floor" in the file name, case insensitive
>>> damas.search("file:/floor.*png$/i")

# List every file containing the word rabbit and wearing the `type` key = `char`
>>> damas.search('file:/rabbit/ type:char')
```
```js
// Javascript
// list every png file containing "floor" in the file name, case insensitive
damas.search("file:/floor.*png$/i");

// List every file containing the word rabbit and wearing the `type` key = `char`
damas.search('file:/rabbit/ type:char');
```

### search_one
Search nodes, returning the first matching occurrence as a node object (not as index as in search). The search string format is the same as for the search method.
```js
search_one ( query [, callback] )
```
#### parameters
* `query` {string}
* `callback` _(js only, optional)_ if specified, the request is asynchronous
#### return values
* returns the first matching identifier or null if no match was found

### search_mongo
We expose the MongoDB find and cursor methods here in order to provide a powerful search with many options. It is only available when the server runs a MongoDB database to store the data.
```js
search_mongo ( query [, sort, limit, skip, callback] )
```
#### parameters
* `query` {object} : the query object https://docs.mongodb.org/v3.0/reference/method/db.collection.find/
* `sort` _(optional)_ : https://docs.mongodb.org/v3.0/reference/method/cursor.sort/
* `limit` _(optional)_ : https://docs.mongodb.org/v3.0/reference/method/cursor.limit/
* `skip` _(optional)_ : https://docs.mongodb.org/v3.0/reference/method/cursor.skip/
* `callback`{function}  _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* returns arrays of matching indexes

> In order to use regular expressions, and because the JSON format only accept strings and has no type for regular expressions, we use strings with the prefix REGEX_ to indicate to the server that it must convert it to a RegExp object before executing the Mongo query. To add options to regular expressions, prefer the syntax RX_`expression`_RX`options`.

    For example: the /.*/ regular expression.

    is written "REGEX_.*" as string format in the JSON messages

    Example with case-insensitive option: /.*/i

    is written "RX_.*_RXi" as string format in the JSON messages

```py
# Python
# get the 10 most recent files (having the higher `time` key on nodes)
>> damas.search_mongo({"file":{"$exists": True}}, {"time":-1}, 10, 0)
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

### graph
Recursively get all source nodes and edges connected to the specified node
```js
graph ( identifiers, [, callback] )
```
#### parameters
* `identifiers` {string | array} : identifier(s) string(s) to read
* `callback` {function} _(js only, optional)_ : if specified, the request is asynchronous
#### return values
* @returns {Array} array of element indexes
#### examples
```js
// Javascript
// retrieve graph as an array containing the elements (nodes and edges)
damas.graph("55687e68e040af7047ee1a53");
```

<!--

### version
#### version( `id`, `keys` [, `callback`] )

Insert a new file as a new version of an existing asset, wearing the specified keys.

* `id` {string} : asset node index string
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

### link
#### link( `target`, `sources`, `keys` [, `callback`] )
Create edges from the sources files to the target file wearing the specified keys. The sources and the target are specified as pathes to the corresponding files.
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