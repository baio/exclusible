import { ISpreadConfig } from '@exclusible/shared';
import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { ConfigService } from './config.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

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
  //@UseGuards(JwtAuthGuard)
  setSpread(@Body() config: SpreadConfigDto) {
    return this.configService.setSpreadConfig(config);
  }

  @Get('spread')
  //@UseGuards(JwtAuthGuard)
  async getSpread() {
    return this.configService.getSpreadConfig();
  }
}
