import { ISpreadConfig } from './models';

export interface IConfigServiceProxy {
  setSpreadConfig(config: ISpreadConfig): Promise<void>;
  getSpreadConfig(): Promise<ISpreadConfig>;
}

