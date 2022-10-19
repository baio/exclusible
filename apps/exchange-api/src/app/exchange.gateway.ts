import { ISpreadConfig } from '@exclusible/shared';
import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import {
  filter,
  from,
  map,
  merge,
  Observable,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs';

import { createWebSocketStream, WebSocket } from 'ws';
import { ConfigService } from './config.service';

export interface IExchangeRate {
  buy: number;
  sell: number;
  timestamp: number;
}

const mapKrakenPrice = (
  config: ISpreadConfig,
  price: number,
  timestamp: number
): IExchangeRate => ({
  buy: price + config.buyOffset,
  sell: price + config.sellOffset,
  timestamp,
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

const mapKrakenEvent = (config: ISpreadConfig, json: object): WsResponse => {
  const price = +json[1][0][0];
  const timestamp = +json[1][0][2] * 1000;
  const rate = mapKrakenPrice(config, price, timestamp);
  return { event: 'exchangeRate', data: [rate.buy, rate.sell, rate.timestamp] };
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExchangeGateway {
  private readonly krakenWs: WebSocket;
  private readonly subscription$: Observable<WsResponse>;

  constructor(private readonly configService: ConfigService) {
    this.krakenWs = new WebSocket('wss://ws.kraken.com/');

    const duplex = createWebSocketStream(this.krakenWs, { encoding: 'utf8' });

    const data$ = from(duplex).pipe(shareReplay(0), map(parseJson));

    // split data stream into 2, one for `trade` data and other for everything else

    // heartbeat
    const heartbeat$ = data$.pipe(filter((d) => d[2] !== 'trade')).pipe(
      map(() =>
        // convert any other event to `heartbeat`
        ({ event: 'heartbeat', data: null })
      )
    );

    // trade
    const trade$ = data$.pipe(filter((d) => d[2] === 'trade'));

    const config$ = trade$.pipe(
      // TODO : cache
      switchMap(() => this.configService.getSpreadConfig())
    );

    const exchange$ = trade$.pipe(
      withLatestFrom(config$),
      map(([data, config]) => {
        return mapKrakenEvent(config, data);
      })
    );

    // emit events both from heartbeat and exchange streams
    this.subscription$ = merge(heartbeat$, exchange$);

    this.krakenWs.on('open', () => {
      this.krakenWs.send(
        '{"event":"subscribe", "subscription":{"name":"trade"}, "pair":["BTC/USD"]}'
      );
    });
  }

  @SubscribeMessage('subscribe')
  subscribe() {
    console.log('subscribe');
    return this.subscription$;
  }
}
