import { ConfigServiceProxy } from '@exclusible/rabbit-service-proxies';
import { CONFIG_SERVICE_PROXY, ISpreadConfig } from '@exclusible/shared';
import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import {
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  retry,
  RetryConfig,
  shareReplay,
  tap,
} from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
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
  const id = `${new Date().getTime()}_${timestamp}`;
  return {
    event: 'exchangeRate',
    data: [id, rate.buy, rate.sell, rate.timestamp],
  };
};

const CACHE_SIZE = 5;

export const GATEWAY_CONFIG = 'GATEWAY_CONFIG';

export interface IGatewayConfig {
  wsUrl: string;
  failureRetryDelay: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExchangeGateway implements OnGatewayConnection {
  private readonly subscription$: Observable<WsResponse>;

  constructor(
    @Inject(GATEWAY_CONFIG) config: IGatewayConfig,
    @Inject(CONFIG_SERVICE_PROXY)
    configServiceProxy: ConfigServiceProxy
  ) {
    const retryConfig: RetryConfig = {
      delay: config.failureRetryDelay,
    };

    const ws$ = webSocket<WsResponse>({
      url: config.wsUrl,
      WebSocketCtor: ws,
    });

    const config$ = configServiceProxy.subscribeSpreadConfigChanged();

    const data$ = ws$.pipe(
      // reconnect on failure
      retry(retryConfig),
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

    const tradeWithSpread$ = combineLatest([trade$, config$]).pipe(
      map(([data, config]) => ({ data, config }))
    );

    const exchange$ = tradeWithSpread$.pipe(
      map(({ data, config }) => mapKrakenEvent(config, data)),
      // cache latest rates, once new client connected they will ber received at once
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
