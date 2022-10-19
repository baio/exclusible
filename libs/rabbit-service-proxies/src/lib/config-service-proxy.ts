import {
  CONFIG_SERVICE_NAME,
  CONFIG_SERVICE_SET_SPREAD_PATTERN_NAME,
  IConfigServiceProxy,
  ISpreadConfig,
} from '@exclusible/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ConfigServiceProxy implements IConfigServiceProxy {
  constructor(
    @Inject(CONFIG_SERVICE_NAME) private readonly brokerService: ClientProxy
  ) {}
  setSpreadConfig(config: ISpreadConfig): Promise<void> {
    return lastValueFrom(
      this.brokerService.send(CONFIG_SERVICE_SET_SPREAD_PATTERN_NAME, config)
    );
  }
  getSpreadConfig(): Promise<ISpreadConfig> {
    return lastValueFrom(
      this.brokerService.send(CONFIG_SERVICE_SET_SPREAD_PATTERN_NAME, config)
    );
  }
}
