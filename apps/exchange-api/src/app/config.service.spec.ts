import { Test } from '@nestjs/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = app.get<ConfigService>(ConfigService);
  });

  describe('getData', () => {
    it('should return "Welcome to exchange-api!"', () => {
      expect(null).toEqual({
        message: 'Welcome to exchange-api!',
      });
    });
  });
});
