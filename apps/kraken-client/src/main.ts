// import { from } from 'rxjs';
// import { createWebSocketStream, WebSocket } from 'ws';

// const ws = new WebSocket('wss://ws.kraken.com/');

// const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

// from(duplex).subscribe(console.log);

// ws.on('open', function open() {
//   console.log('open');
//   ws.send('{"event":"subscribe", "subscription":{"name":"ticker"}, "pair":["BTC/USD"]}');
// });

// ws.on('message', function message(data) {
//   console.log('received', data.toString('utf-8'));
// });

import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:3333');

socket.on('connect', function open() {
  console.log('open');
  //ws.send('{"event":"subscribe", "subscription":{"name":"ticker"}, "pair":["BTC/USD"]}');
  socket.emit('ping', 1);
});

socket.on('pong', function message(data) {
  console.log('received', data);
});

