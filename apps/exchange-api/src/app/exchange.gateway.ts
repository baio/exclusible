import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { from, map, Observable, refCount, share, shareReplay, tap } from 'rxjs';
import { Server } from 'socket.io';

import { createWebSocketStream, WebSocket } from 'ws';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExchangeGateway {
  @WebSocketServer()
  server: Server;

  private readonly krakenWs: WebSocket;
  private readonly krakenStream$: Observable<string>;

  constructor() {
    this.krakenWs = new WebSocket('wss://ws.kraken.com/');

    const duplex = createWebSocketStream(this.krakenWs, { encoding: 'utf8' });

    this.krakenStream$ = from(duplex).pipe(
      map((data) => ({ event: 'pong', data })),
      tap(console.log),
      shareReplay(0),
      refCount
    );

    this.krakenWs.on('open', () => {
      this.krakenWs.send(
        '{"event":"subscribe", "subscription":{"name":"ticker"}, "pair":["BTC/USD"]}'
      );
    });
  }

  @SubscribeMessage('ping')
  listenForMessages(@MessageBody() data: string) {
    console.log('ping !');
    return this.krakenStream$;
  }
}
