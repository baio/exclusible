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

// import { io, Socket } from 'socket.io-client';

// const socket = io('http://localhost:3333');

// socket.on('connect', function open() {
//   console.log('connect');
//   socket.emit('subscribe');
// });

// socket.on('exchangeRate', function message(data) {
//   console.log('exchangeRate', data);
// });

// socket.on('heartbeat', function message(data) {
//   console.log('heartbeat', data);
// });

import { WebSocket } from 'ws';

const ws = new WebSocket('ws://localhost:3333/');

ws.on('open', (data) => {
  console.log('open!', data);
  ws.send('{ "event": "subscribe" }');
});

ws.on('message', (data) => {
  console.log('exchangeRate', data.toString());
});
