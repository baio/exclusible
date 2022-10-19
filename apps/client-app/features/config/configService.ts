import { ISpreadConfig } from '@exclusible/shared';
import { dataAccess } from '../shared';
import { SpreadConfig } from './configModels';

export const getSpreadConfig = async () => {
  return dataAccess.get<ISpreadConfig>('config/spread');
};

export const saveSpreadConfig = async (config: SpreadConfig) => {
  return dataAccess.post<ISpreadConfig>('config/spread', config);
};
