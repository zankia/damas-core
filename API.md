The API is divided into chapters: nodes and links (`create` `read` `update` `delete`), search (`search`), assets (`lock`, `unlock`), graphs (`graph`) and authentication (`signin` `signout` `verify`).

The implementations for Python and Javascript use the native types available in the languages - like Python dictionnaries and Javascript Objects.

# Nodes and links

## /api/create
Creates a node wearing the specified keys.

* @param {hash} keys - Hash of key:value pairs
* @param {function} [callback] - Function taking the returned result as argument (_Javascript only_)
* @returns {object|boolean} New node on success, false otherwise

```python
# Python
# create a new node
>>> project.create({"key1":"value1"})
{u'key1': u'value1', u'time': 1437469470133, u'_id': u'55ae0b1ed81e88357d77d0e9', u'author': u'demo'}
```

> in Javascript, if a callback function is specified the creation will be made asynchronously, or synchronously otherwise.

```js
// Javascript
// keys for our node
var keys = {name:'test',type:'char'};

// synchronous creation
var node = damas.create(keys);
console.log(node);

// asynchronous in case a function is provided
var newNode = damas.create(keys, function(node){
    console.log(node);
});
```

In case of a successful node creation, the created object is returned. It always wear a `_id` key which is its unique id string in the database, and can have more keys depending on the behavior of the server:

```js
Object { _id="560061f2d4cb24441ed88aa4", author="demo", name="test", time=1442865650145, type="char" }
```

From Damas 2.4, the data model changed and now links are also nodes, which means that we use the same methods to create and maintain nodes and links.

```python
# Python
# create a new link
project.create({"src_id":"55ae0b1ed81e88357d77d0e9","tgt_id":"560061f2d4cb24441ed88aa4"})
```

HTTP status codes `200` `400` `409`

## /api/read
Retrieve one or many nodes, specifying index(es)
* @param {string|string[]} id - internal node index(es) to read. accepts arrays or comma separated indexes to read multiple nodes
* @param {function} callback optional callback function to call for asynchrone mode. if undefined, fall back to synchrone mode.
* @returns {object|object[]|undefined} Node or array of nodes
```js
var ids=[id1,id2];

//Get one node
var node = damas.read(id1);

//Get a group of nodes
var nodes= damas.read(ids);
```
## /api/update
Modify keys on the specified node(s). The specified keys overwrite existing keys, others are left untouched. A null key value removes the key.
* @param {string|array} id - index(es) of the node to update
* @param {object} keys - Hash of key:value pairs
* @returns {array|undefined} modified nodes or nothing in case of asynchronous call
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
* @param {string} id - Node internal index to delete
* @param {function} [callback] - Function to call, boolean argument
* @returns {boolean} true on success, false otherwise
```js
// Javascript
damas.delete(id);
```

## /api/search
Find elements wearing the specified key(s)
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
Lock the asset for edition, for the current user. Sets a `lock` key on the node, with the authenticated username as value. If the asset is already locked, it will return false.
* @param {String} id asset node index
* @param {function} [callback] - Function to call, accepting a boolean argument
* @return {Boolean} true on success, false otherwise

## /api/unlock
Unlock a locked asset. If the asset is not locked or locked for someone else (`lock` key value != authenticated user name) it returns false. If it was successfully unlocked, returns true.
* @param {String} id asset node index
* @param {function} [callback] - Function to call, accepting a boolean argument
* @return {Boolean} true on success, false otherwise

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
