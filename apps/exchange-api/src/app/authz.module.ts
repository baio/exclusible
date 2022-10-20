import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AUTH0_ISSUER_URL, JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthzModule {
  static register(issuerUrl: string): DynamicModule {
    return {
      module: AuthzModule,
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        { provide: AUTH0_ISSUER_URL, useValue: issuerUrl },
        JwtStrategy,
      ],
      exports: [PassportModule],
    };
  }
}
