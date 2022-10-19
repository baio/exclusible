import { ConfigServiceProxyModule } from '@exclusible/rabbit-service-proxies';
import { Module } from '@nestjs/common';
import { AuthzModule } from './authz.module';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

import { ExchangeGateway } from './exchange.gateway';

@Module({
  imports: [
    ConfigServiceProxyModule.registerDefaultConfig(
      process.env.RABBIT_CONFIG_QUEUE
    ),
    AuthzModule,
  ],
  controllers: [ConfigController],
  providers: [ExchangeGateway, ConfigService],
})
export class AppModule {}
