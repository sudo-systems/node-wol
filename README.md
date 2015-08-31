Wake on LAN for node.js
=======================

This is a fork of (node_wake_on_lan)[https://github.com/agnat/node_wake_on_lan] by (agnat)[https://github.com/agnat]. Credits go to him.

Install via `npm install node-wol`

Usage
-----
```js
var wol = require('node-wol');

wol.wake('20:DE:20:DE:20:DE');

wol.wake('20:DE:20:DE:20:DE', function(error) {
  if(error) {
    // handle error
    return;
  }
});

var magicPacket = wol.createMagicPacket('20:DE:20:DE:20:DE');
```

Optional options
-------
* address (optional ip address)
* port (optional port; default is 9)

```js
wol.wake('20:DE:20:DE:20:DE', {
  address: '192.168.10.12',
  port: 7
}, function(error) {
  if(error) {
    // handle error
    return;
  }
});
```