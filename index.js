var dgram = require('dgram');
var net = require('net');
var Buffer = require('buffer').Buffer;
var macBytes = 6;

exports.createMagicPacket = function(macAddress) {
  var macBuffer = new Buffer(macBytes);
  var i;
  var numMacs = 16;
  var buffer = new Buffer((1 + numMacs) * macBytes);
  
  if(macAddress.length === (2 * macBytes + (macBytes - 1))) {
    macAddress = macAddress.replace(new RegExp(macAddress[2], 'g'), '');
  }
  
  if(macAddress.length !== (2 * macBytes || macAddress.match(/[^a-fA-F0-9]/))) {
    throw new Error('malformed MAC address \'' + macAddress + '\'');
  }

  for(var i = 0; i < macBytes; ++i) {
    macBuffer[i] = parseInt(macAddress.substr((2 * i), 2), 16);
  }
  
  for(var i = 0; i < macBytes; ++i) {
    buffer[i] = 0xff;
  }
  
  for(var i = 0; i < numMacs; ++i) {
    macBuffer.copy(buffer, (i + 1) * macBytes, 0, macBuffer.length);
  }
  
  return buffer;
};

exports.wake = function(macAddress, options, callback) {
  if(options.constructor === Function) {
    callback = options;
    options = {};
  }
  
  var _options = {
    address: (options.address)? options.address : '255.255.255.255',
    port: (options.port)? options.port : 9
  };

  var magicPacket = exports.createMagicPacket(macAddress);
  var protocol = net.isIPv6(_options.address) ? 'udp6' : 'udp4';
  var socket = dgram.createSocket(protocol);
  
  socket.send(magicPacket, 0, magicPacket.length, _options.port, _options.address, function(error) {
    if(!error) {
      callback();
    }
  });
  
  socket.on('error', function(error) {
    callback('ERROR: '+error.stack);
    socket.close();
  });

  socket.once('listening', function() {
    socket.setBroadcast(true);
  });
};