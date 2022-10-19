export interface SpreadConfig {
  buyOffset: number;
  sellOffset: number;
}

export interface ConfigState {
  spread: SpreadConfig;
}
