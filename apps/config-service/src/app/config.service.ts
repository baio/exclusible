import { ISpreadConfig } from '@exclusible/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ConfigEntity, DEFAULT_ID } from './config.entity';

const defaultSpreadConfig: ISpreadConfig = {
  buyOffset: -1,
  sellOffset: 1,
};

@Injectable()
export class ConfigService {
  private readonly spreadConfig$ = new BehaviorSubject(defaultSpreadConfig);
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>
  ) {
    this.init();
  }

  private async init() {
    Logger.debug('ConfigService:init');
    const result = await this.configRepository.findOneBy({ id: DEFAULT_ID });
    Logger.debug('get entity', result);
    if (result) {
      const data = {
        buyOffset: result.spreadBuyOffset,
        sellOffset: result.spreadSellOffset,
      };
      this.spreadConfig$.next(data);
    }
  }

  async setSpreadConfig(config: ISpreadConfig) {
    Logger.debug(`ConfigService:setSpreadConfig`, config);
    const entity = new ConfigEntity(config);
    Logger.debug(entity);
    const result = await this.configRepository.save(entity);
    Logger.debug(result);
    this.spreadConfig$.next(config);
    return config;
  }

  async getSpreadConfig(): Promise<ISpreadConfig> {
    Logger.debug('ConfigService:getSpreadConfig');
    return this.spreadConfig$.value;
  }

  subscribeSpreadConfigChanged(): Observable<ISpreadConfig> {
    Logger.debug('ConfigService:subscribeSpreadConfigChanged');
    return this.spreadConfig$ as Observable<ISpreadConfig>;
  }
}
