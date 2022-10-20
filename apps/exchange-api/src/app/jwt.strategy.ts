import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

// TODO : Pass params through config !
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('wtf ???');
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: false,
        rateLimit: false,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://baio.eu.auth0.com/.well-known/jwks.json',
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `https://baio.eu.auth0.com/api/v2/`,
      issuer: 'https://baio.eu.auth0.com/',
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    console.log('222', payload);
    return payload;
  }
}