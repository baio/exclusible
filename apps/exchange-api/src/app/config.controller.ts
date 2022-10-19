import { ISpreadConfig } from '@exclusible/shared';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsNumber, IsNotEmpty } from 'class-validator';

import { ConfigService } from './config.service';

export class SpreadConfigDto implements ISpreadConfig {
  @IsNotEmpty()
  @IsNumber()
  buyOffset: number;

  @IsNotEmpty()
  @IsNumber()
  sellOffset: number;
}

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post('spread')
  setSpread(@Body() config: SpreadConfigDto) {
    return this.configService.setSpreadConfig(config);
  }

  @Get('spread')
  async getSpread() {
    return this.configService.getSpreadConfig();
  }
}
