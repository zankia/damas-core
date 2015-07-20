# API

The API is available as a web service accessible through standard HTTP requests and as implementations for different languages. The implementations follow the same specifications, in order to provide the same methods for the web service and for the different programming languages (Javascript and Python so far).

The web service sends results as JSON, and errors as HTTP errors (200, 404, etc).

The implementations for the differents programming languages use the native types available in the programming languages (like Javascript Objects and Python dictionaries).

## Nodes

### damas.create( keys, [callback] )
Creates a node with the specified keys, asynchronously if a callback function is specified or synchronously otherwise.
* @param {hash} keys - Hash of key:value pairs
* @param {function} [callback] - Function with the XHR object as argument to call
* @returns {object|boolean|undefined} New node on success, false otherwise (or nothing if async)

```js
// Javascript
// Create a set of keys for our node
var keys= {name:'test',type:'char'};

//Create a new node using this set of keys
var newNode = damas.create(keys);
```

In Javascript we can call these methods in an asynchronous manner:
```js
// Javascript
// Create a new node asynchronously providing a function to process the result
var newNode = damas.create({name:'test',type:'char'}, function(json){
    console.log(json);
});
```

* HTTP result: 200, 400, 409


### damas.read( indexes, [callback] )
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
### damas.update( id, keys, [callback] )
Update the keys of a node. The specified keys overwrite existing keys, others are left untouched. A null key value removes the key.
* @param {string} id - Internal index of the node to update
* @param {object} keys - Hash of key:value pairs
* @returns {object|undefined} Node or nothing in case of asynchronous call
```js
//Create a set of keys for our node
var keys = {name:'test2',newKey:'name'};

//Update the node id with this set of keys
var node = damas.update(id, keys);
```
In Python the None value is used to remove a key
```python
// Python
// This will remove the key2 key
project.update(id, {"key1": "value1", "key2": None})

```
### damas.delete( indexes, [callback] )
Recursively delete the specified node
* @param {string} id - Node internal index to delete
* @param {function} callback - Function to call, boolean argument
* @returns {boolean} true on success, false otherwise
```js
// Javascript
damas.delete(id);
```

### damas.search( query, [callback] )
Find elements wearing the specified key(s)
* @param {String} search query string
* @returns {Array} array of element indexes or null if no element found

```js
// Javascript
var matches = damas.search('rabbit type:char');
```

## Graphs

### damas.graph( indexes, [callback] )
Recursively get all links and nodes sourced by the specified node
* @param {String} id - Node index
* @param {function} callback - Function to call, array argument
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

### damas.lock( id )
Lock the asset for the current user
* @param {String} id asset node index
* @return {Boolean} true on success, false otherwise

### damas.unlock( id )
Unlock the asset so other users can lock it for edition
* @param {String} id asset node index
* @return {Boolean} true on success, false otherwise
-->