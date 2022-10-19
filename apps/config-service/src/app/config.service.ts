import { ISpreadConfig } from '@exclusible/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity, DEFAULT_ID } from './config.entity';

const defaultSpreadConfig: ISpreadConfig = {
  buyOffset: -1,
  sellOffset: 1,
};

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>
  ) {}

  async setSpreadConfig(config: ISpreadConfig) {
    Logger.debug(`ConfigService:setSpreadConfig`, config);
    const entity = new ConfigEntity(config);
    Logger.debug(entity);
    const result = await this.configRepository.save(entity);
    Logger.debug(result);
    return config;
  }

  async getSpreadConfig(): Promise<ISpreadConfig> {
    Logger.debug('ConfigService:getSpreadConfig');
    const result = await this.configRepository.findOneBy({ id: DEFAULT_ID });
    Logger.debug('get entity', result);
    if (!result) {
      // config yet not set return default one
      return defaultSpreadConfig;
    } else {
      return {
        buyOffset: result.spreadBuyOffset,
        sellOffset: result.spreadSellOffset,
      };
    }
  }
}
