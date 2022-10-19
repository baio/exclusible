import { ConfigServiceProxy } from '@exclusible/rabbit-service-proxies';
import { CONFIG_SERVICE_PROXY, ISpreadConfig } from '@exclusible/shared';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // we can cache spreadConfig here but it wont work if we would have many instances of the current service deployed
  // TODO : cache for some period
  // private spreadConfig?: ISpreadConfig;

  constructor(
    @Inject(CONFIG_SERVICE_PROXY)
    private readonly configServiceProxy: ConfigServiceProxy
  ) {}

  setSpreadConfig(config: ISpreadConfig) {
    return this.configServiceProxy.setSpreadConfig(config);
  }

  getSpreadConfig() {
    return this.configServiceProxy.getSpreadConfig();
  }
}
