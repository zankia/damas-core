We provide an event API, designed for extending the system. This page documents the external API, accessible via WebSockets. For the internal API specifications, see [pull #112](https://github.com/remyla/damas-core/pull/112#issuecomment-218803699)

We provide three events:
- `create`
- `update`
- `delete`

Here is a sample JavaScript client (see `js/damas-socket.js`):

```javascript

var address = location.protocol + '//' + location.host;
var socket = io.connect(address, { path: '/socket.io' });

window.addEventListener('beforeunload', function (event) {
    socket.close();
});

socket.on('connect', function () {
    console.log('Connected to the Socket server ' + address);
});

socket.on('disconnect', function (reason) {
    console.log('Disconnected: ' + reason);
});

socket.on('create', function (nodes) {
    console.log(nodes.length + ' nodes created');
    console.log(nodes);
});

socket.on('update', function (nodes) {
    console.log(nodes.length + ' nodes updated');
    console.log(nodes);
});

socket.on('remove', function (nodes) {
    console.log(nodes.length + ' nodes removed');
    console.log(nodes);
});
```