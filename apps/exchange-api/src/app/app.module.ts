import { ConfigServiceProxyModule } from '@exclusible/rabbit-service-proxies';
import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

import { ExchangeGateway } from './exchange.gateway';

@Module({
  imports: [
    ConfigServiceProxyModule.registerDefaultConfig(
      process.env.RABBIT_CONFIG_QUEUE
    ),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class AppModule {}
