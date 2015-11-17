For a start guide please see this wiki [Home](Home) page.

The API is divided into chapters:

[Nodes](#nodes): [`create`](#apicreate) [`read`](#apiread) [`update`](#apiupdate) [`delete`](#apidelete)

[Search](#search): [`search`](#apisearch)

[Assets](#assets): [`lock`](#apilock) [`unlock`](#apiunlock) [`version`](#apiversion) `variation*` `reference*` `write*`

[Graphs](#graphs): `ancestors*` [`graph`](#apigraph)

[Authentication](#authentication): [`signIn`](#apisignIn) [`signOut`](#apisignOut) [`verify`](#apiverify)

\* Not implemented yet in NodeJS

> The Python and Javascript implementations of the API use the native types available in the languages - Python uses dictionaries for nodes, None for null values. Javascript uses Objects to describe nodes.

# Nodes

## /api/create
Creates a node wearing the specified keys.

__create( `keys`, [`callback`] )__

* `keys` key:value pairs
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* Returns the new node on success, false otherwise


```python
# Python
# create a new node
>>> project.create({"key1":"value1"})
{u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}
```

> in Javascript, if a callback function is specified the creation will be made asynchronously, or synchronously otherwise.

```js
// Javascript
var keys = {name:'test',type:'char'};
// asynchronous mode
var newNode = damas.create(keys, function(node){
    console.log(node);
});
```

In case of a successful node creation, the created object is returned. It always wear a `_id` key which is its unique id string in the database, and can have more keys depending on the behavior of the server:

```js
Object { _id="560061f2d4cb24441ed88aa4", author="demo", name="test", time=1442865650145, type="char" }
```

HTTP status codes `201` `400` `409`

## /api/read
Retrieve the keys of one or many nodes indexes.

__read( `id`, [`callback`] )__
* `id` node index as string, string of comma separated indexes, or array
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

## /api/update
Modify the keys on the specified node(s).

__update( `ids`, `keys`, [`callback`] )__

* `id` node index as string, string of comma separated indexes, or array
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

In __Python__, indexes can be specified as a string (containing one or multiple node indexes separated by comma) or a Python list. The None value is used to remove a key.

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


## /api/delete
Recursively delete the specified node

__delete( `ids`, [`callback`] )__

* `id` node index as string, string of comma separated indexes, or array
* `callback` _(optional)_ (_js only_) function to call for asynchronous mode
* Returns true on success, false otherwise

```js
// Javascript
damas.delete(id);
```
# Search
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
* operators list: <, <=, >, >=, :
* in case of : operator, you can use a regular expression as value
* "file:/floor.*png/" will list every png file containing "floor" in the file name


# Graphs

From Damas 2.4, the data model changed and we are now describing links as nodes. This means that unlink and link methods don't exist anymore, the same methods are used to create and maintain nodes and links.

```python
# Python
# create a new link
project.create({"src_id":"55ae0b1ed81e88357d77d0e9","tgt_id":"560061f2d4cb24441ed88aa4"})
```

## /api/graph
Recursively get all links and nodes sourced by the specified node
* @param {String} id - Node indexes
* @param {function} [callback] - Function to call, array argument
* @returns {Array} array of element indexes

```js
// Javascript
// This will return an array containing nodes (links are nodes too)
var sources = damas.graph("55687e68e040af7047ee1a53");
```

Link between 2 nodes is also a node. It is wearing the reserved keys ___src_id___ and ___tgt_id___ to specify the source and the target of the link. Therefore, to create a link, use the create method specifying the source and target nodes to link with 
```Python
# Python
# Create a link between 2 nodes
create({"src_id":"xxxx", "tgt_id":"yyyy"})
```

# Assets

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

HTTP status codes: `200` `400` `401`

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

## /api/signIn
Sign in using the server embeded authentication system
* @param {String} username the user id
* @param {String} password the user secret password
* @param {function} [callback] - Function to call, accepting a node (object or dictionnary) as argument
* @return User node on success, false otherwise

## /api/signOut
* @param {function} [callback] - Function to call, accepting a boolean argument
* @return true on success, false otherwise

## /api/verify
Check if the authentication is valid
* @param {function} [callback] - Function to call, accepting a boolean argument
* @return true on success, false otherwise
