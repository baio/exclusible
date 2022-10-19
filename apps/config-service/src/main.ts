import * as dotenv from 'dotenv';
dotenv.config();

import { createServiceDefaultConfig } from '@exclusible/rabbit-service-factory';
import { Logger } from '@nestjs/common';
import { ConfigModule } from './app/config.module';

async function bootstrap() {
  await createServiceDefaultConfig(
    process.env.RABBIT_CONFIG_QUEUE,
    ConfigModule
  );
  Logger.log(`🚀 config-service started`);
}

bootstrap();
