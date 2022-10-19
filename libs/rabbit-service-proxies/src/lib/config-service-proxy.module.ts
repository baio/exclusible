import { readConfig } from '@exclusible/rabbit-service-config';
import { CONFIG_SERVICE_NAME, CONFIG_SERVICE_PROXY } from '@exclusible/shared';
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigServiceProxy } from './a-service-proxy';

import { IConfig } from './config';

@Module({})
export class ConfigServiceProxyModule {
  static registerDefaultConfig(queue: string): DynamicModule {
    const config = readConfig();
    return ConfigServiceProxyModule.register({ ...config, queue });
  }

  static register(config: IConfig): DynamicModule {
    return {
      imports: [
        ClientsModule.register([
          {
            name: CONFIG_SERVICE_NAME,
            transport: Transport.RMQ,
            options: {
              urls: config.urls,
              queue: config.queue,
              queueOptions: {
                durable: config.isDurable || false,
              },
            },
          },
        ]),
      ],
      module: ConfigServiceProxyModule,
      providers: [
        {
          provide: CONFIG_SERVICE_PROXY,
          useClass: ConfigServiceProxy,
        },
      ],
      exports: [CONFIG_SERVICE_PROXY],
    };
  }
}
