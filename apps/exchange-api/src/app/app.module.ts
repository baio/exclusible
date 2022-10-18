import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeGateway } from './exchange.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ExchangeGateway],
})
export class AppModule {}
