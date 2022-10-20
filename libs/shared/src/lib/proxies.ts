import { Observable } from 'rxjs';
import { ISpreadConfig } from './models';

export interface IConfigServiceProxy {
  setSpreadConfig(config: ISpreadConfig): Promise<void>;
  getSpreadConfig(): Promise<ISpreadConfig>;
  subscribeSpreadConfigChanged(): Observable<ISpreadConfig>;
}

