import { IConfig } from './config';

// TODO : Make some validations here and throw exception if something missed or in bad format
export const readConfig = () =>
  ({
    urls: [process.env.RABBIT_URL],
    isDurable: Boolean(+process.env.RABBIT_IS_DURABLE),
  } as IConfig);
