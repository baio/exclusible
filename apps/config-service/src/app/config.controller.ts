import {
  CONFIG_SERVICE_GET_SPREAD_PATTERN_NAME,
  CONFIG_SERVICE_SET_SPREAD_PATTERN_NAME,
  ISpreadConfig,
} from '@exclusible/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ConfigService } from './config.service';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @MessagePattern(CONFIG_SERVICE_SET_SPREAD_PATTERN_NAME)
  setSpreadConfig(config: ISpreadConfig) {
    // we could validate IMessage fields here or even create dto with validation attributes on fields,
    // but since this method is called only from code controlled by us it safe to skip it for simplicity

    return this.configService.setSpreadConfig(config);
  }

  @MessagePattern(CONFIG_SERVICE_GET_SPREAD_PATTERN_NAME)
  getSpreadConfig() {
    // we could validate IMessage fields here or even create dto with validation attributes on fields,
    // but since this method is called only from code controlled by us it safe to skip it for simplicity
    return this.configService.getSpreadConfig();
  }
}
