import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable, shareReplay } from 'rxjs';
import { Server } from 'socket.io';

import { createWebSocketStream, WebSocket } from 'ws';

export interface ISpreadConfig {
  // fixed number to add to current price for buying
  buy: number;
  // fixed number to add to current price for selling
  sell: number;
}

export interface IExchangeRate {
  buy: number;
  sell: number;
}

const mapKrakenPrice = (
  config: ISpreadConfig,
  price: number
): IExchangeRate => ({
  buy: price + config.buy,
  sell: price + config.sell,
});

/**
 * Parse json safely, if the string is not Json object return empty array
 */
const parseJson = (str: string) => {
  try {
    const json = JSON.parse(str);
    return json;
  } catch {
    return [];
  }
};

const mapKrakenEvent = (config: ISpreadConfig, data: string): WsResponse => {
  const json = parseJson(data);
  const channelName = json[2];
  if (channelName === 'trade') {
    const price = +json[1][0][0];
    const rate = mapKrakenPrice(config, price);
    return { event: 'exchangeRate', data: [rate.buy, rate.sell] };
  } else {
    // convert any other event to `heartbeat`
    return { event: 'heartbeat', data: null };
  }
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExchangeGateway {
  @WebSocketServer()
  server: Server;

  private readonly krakenWs: WebSocket;
  private readonly krakenStream$: Observable<WsResponse>;

  constructor() {
    const config: ISpreadConfig = { buy: -1, sell: 1 };

    this.krakenWs = new WebSocket('wss://ws.kraken.com/');

    const duplex = createWebSocketStream(this.krakenWs, { encoding: 'utf8' });

    this.krakenStream$ = from(duplex).pipe(
      map((data) => mapKrakenEvent(config, data)),
      shareReplay(0)
    );

    this.krakenWs.on('open', () => {
      this.krakenWs.send(
        '{"event":"subscribe", "subscription":{"name":"trade"}, "pair":["BTC/USD"]}'
      );
    });
  }

  @SubscribeMessage('subscribe')
  subscribe() {
    return this.krakenStream$;
  }
}
