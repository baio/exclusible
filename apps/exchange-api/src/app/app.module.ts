import { ConfigServiceProxyModule } from '@exclusible/rabbit-service-proxies';
import { Module } from '@nestjs/common';
import { AuthzModule } from './authz.module';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

import { ExchangeGateway, WS_URL } from './exchange.gateway';

@Module({
  imports: [
    ConfigServiceProxyModule.registerDefaultConfig(
      process.env.RABBIT_CONFIG_QUEUE
    ),
    AuthzModule.register(process.env.AUTH0_ISSUER_URL),
  ],
  controllers: [ConfigController],
  providers: [
    { provide: WS_URL, useValue: process.env.KRAKEN_WS_URL },
    ExchangeGateway,
    ConfigService,
  ],
})
export class AppModule {}
