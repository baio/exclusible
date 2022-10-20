import { ConfigServiceProxyModule } from '@exclusible/rabbit-service-proxies';
import { Module } from '@nestjs/common';
import { AuthzModule } from './authz.module';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

import {
  ExchangeGateway,
  GATEWAY_CONFIG,
  IGatewayConfig,
} from './exchange.gateway';

const gatewayConfig: IGatewayConfig = {
  wsUrl: process.env.KRAKEN_WS_URL,
  failureRetryDelay: +process.env.KRAKEN_FAILURE_RETRY_DELAY || 3000,
};
@Module({
  imports: [
    ConfigServiceProxyModule.registerDefaultConfig(
      process.env.RABBIT_CONFIG_QUEUE
    ),
    AuthzModule.register(process.env.AUTH0_ISSUER_URL),
  ],
  controllers: [ConfigController],
  providers: [
    { provide: GATEWAY_CONFIG, useValue: gatewayConfig },
    ExchangeGateway,
    ConfigService,
  ],
})
export class AppModule {}
