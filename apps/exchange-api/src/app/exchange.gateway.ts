import { ISpreadConfig } from '@exclusible/shared';
import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import {
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
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

const CACHE_SIZE = 5;

export const WS_URL = 'WS_URL';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExchangeGateway implements OnGatewayConnection {
  private readonly subscription$: Observable<WsResponse>;

  constructor(
    @Inject(WS_URL) wsUrl: string,
    private readonly configService: ConfigService
  ) {
    const ws$ = webSocket<WsResponse>({
      url: wsUrl,
      WebSocketCtor: ws,
    });

    const data$ = ws$.pipe(
      tap((evt) => {
        if (evt.event === 'systemStatus') {
          Logger.debug('subscribe to kraken', evt);
          ws$.next({
            event: 'subscribe',
            subscription: { name: 'trade' },
            pair: ['BTC/USD'],
          } as any);
        }
      })
    );

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
        const evt = mapKrakenEvent(config, data);
        return evt;
      }),
      shareReplay(CACHE_SIZE)
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
    Logger.debug('new subscription');
    return this.subscription$;
  }
}
