import {
  CONFIG_SERVICE_GET_SPREAD_PATTERN_NAME,
  CONFIG_SERVICE_NAME,
  CONFIG_SERVICE_SET_SPREAD_PATTERN_NAME,
  CONFIG_SERVICE_SUBSCRIBE_SPREAD_CHANGED_PATTERN_NAME,
  IConfigServiceProxy,
  ISpreadConfig,
} from '@exclusible/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class ConfigServiceProxy implements IConfigServiceProxy {
  constructor(
    @Inject(CONFIG_SERVICE_NAME)
    private readonly configServiceProxy: ClientProxy
  ) {}
  setSpreadConfig(config: ISpreadConfig): Promise<void> {
    return lastValueFrom(
      this.configServiceProxy.send(
        CONFIG_SERVICE_SET_SPREAD_PATTERN_NAME,
        config
      )
    );
  }
  async getSpreadConfig(): Promise<ISpreadConfig> {
    return await lastValueFrom(
      this.configServiceProxy.send(CONFIG_SERVICE_GET_SPREAD_PATTERN_NAME, {})
    );
  }

  subscribeSpreadConfigChanged(): Observable<ISpreadConfig> {
    return this.configServiceProxy.send<any, ISpreadConfig>(
      CONFIG_SERVICE_SUBSCRIBE_SPREAD_CHANGED_PATTERN_NAME,
      {} as any
    );
  }
}
