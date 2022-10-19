import { ISpreadConfig } from '@exclusible/shared';
import { dataAccess } from '../shared';

export const getSpreadConfig = async () => {
  return dataAccess.get<ISpreadConfig>('config/spread');
};
