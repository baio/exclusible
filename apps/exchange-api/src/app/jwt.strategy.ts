import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

const AUTH0_ISSUER_URL = process.env.AUTH0_ISSUER_URL;

// TODO : Pass params through config !
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('wtf ???', AUTH0_ISSUER_URL);
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: false,
        rateLimit: false,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${AUTH0_ISSUER_URL}api/v2/`,
      issuer: AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}
