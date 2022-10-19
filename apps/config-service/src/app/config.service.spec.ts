import { Test } from '@nestjs/testing';

import { ConfigService } from './config.service';

describe('AppService', () => {
  let service: ConfigService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = app.get<ConfigService>(ConfigService);
  });

  describe('getData', () => {
    it('should return "Welcome to config-service!"', () => {
      expect(true).toEqual({
        message: 'Welcome to config-service!',
      });
    });
  });
});
