export interface Rate {
  id: string, 
  buy: number;
  sell: number;
  timestamp: number;
}

export interface WsEvent {
  event: 'exchangeRate' | 'heartbeat' | 'open';
  data: [string, number, number, number];
}

export interface RateState {
  rates: Rate[];
}
