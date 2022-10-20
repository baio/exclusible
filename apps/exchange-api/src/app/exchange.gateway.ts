import { ISpreadConfig } from '@exclusible/shared';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { filter, map, merge, Observable, switchMap, tap } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { ConfigService } from './config.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ws = require('ws');

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
export class ExchangeGateway implements OnGatewayConnection {
  private readonly krakenWs: WebSocket;
  private readonly subscription$: Observable<WsResponse>;

  constructor(private readonly configService: ConfigService) {
    const ws$ = webSocket<WsResponse>({
      url: 'wss://ws.kraken.com/',
      WebSocketCtor: ws,
    });

    const data$ = ws$.pipe(
      tap((evt) => {
        if (evt.event === 'systemStatus') {
          console.log('subscribe !', evt);
          ws$.next({
            event: 'subscribe',
            subscription: { name: 'trade' },
            pair: ['BTC/USD'],
          } as any);
        }
      })
    ); //.pipe(shareReplay(0));

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

    const tradeWithSpread$ = trade$.pipe(
      switchMap(async (data) => {
        const config = await this.configService.getSpreadConfig();
        return { data, config };
      })
    );

    const exchange$ = tradeWithSpread$.pipe(
      map(({ data, config }) => {
        return mapKrakenEvent(config, data);
      })
    );

    // emit events both from heartbeat and exchange streams
    this.subscription$ = merge(heartbeat$, exchange$);
  }
  handleConnection(client: WebSocket, ...args: any[]) {
    Logger.debug('new connection');
    client.send('{"event": "open"}');
  }

  @SubscribeMessage('subscribe')
  subscribe() {
    Logger.debug('new subscribtion');
    return this.subscription$;
  }
}
