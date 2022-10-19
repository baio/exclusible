import { ISpreadConfig } from '@exclusible/shared';
import { Body, Controller, Get, Post } from '@nestjs/common';

import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post('spread')
  setSpread(@Body() config: ISpreadConfig) {
    // TODO : DTO validation
    return this.configService.setSpreadConfig(config);
  }

  @Get('spread')
  async getSpread() {
    return this.configService.getSpreadConfig();
  }
}
