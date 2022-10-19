import { readConfig } from '@exclusible/rabbit-service-config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IConfig } from './config';
import { DomainExceptionFilter } from './domain-exception.filter';

export const createService = async (config: IConfig, module: any) => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    module,
    {
      transport: Transport.RMQ,
      options: {
        urls: config.urls,
        queue: config.queue,
        queueOptions: {
          durable: config.isDurable,
        },
      },
    }
  );
  app.useGlobalFilters(new DomainExceptionFilter());
  await app.listen(() => {
    return null;
  });
};

export const createServiceDefaultConfig = async (
  queue: string,
  module: any
) => {
  const config = readConfig();
  return createService({ ...config, queue }, module);
};
