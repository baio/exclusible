import { ISpreadConfig } from '@exclusible/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity, DEFAULT_ID } from './config.entity';

const defaultSpreadConfig: ISpreadConfig = {
  buy: -1,
  sell: 1,
};

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>
  ) {}

  async setSpreadConfig(config: ISpreadConfig) {
    Logger.debug(`ConfigService:setSpreadConfig ${config}`);
    const entity = new ConfigEntity(config);
    await this.configRepository.save(entity);
    return config;
  }

  async getSpreadConfig() {
    Logger.debug('ConfigService:getSpreadConfig');
    const result = await this.configRepository.findOneBy({ id: DEFAULT_ID });
    Logger.debug('get entity', result);
    if (!result) {
      // config yet not set return default one
      return defaultSpreadConfig;
    } else {
      return { buy: result.spreadBuyOffset, sell: result.spreadSellOffset };
    }
  }
}
