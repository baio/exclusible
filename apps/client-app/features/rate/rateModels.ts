export interface Rate {
  buy: number;
  sell: number;
  timestamp: number;
}

export interface RateState {
  rates: Rate[];
}
