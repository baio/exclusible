export interface Rate {
  buy: number;
  sell: number;
  timestamp: number;
}

export interface WsEvent {
  event: 'exchangeRate' | 'heartbeat' | 'open';
  data: [number, number, number];
}

export interface RateState {
  rates: Rate[];
}
