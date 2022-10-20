import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const AUTH0_ISSUER_URL = 'AUTH0_ISSUER_URL';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH0_ISSUER_URL) issuerUrl: string) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: false,
        rateLimit: false,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuerUrl}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${issuerUrl}api/v2/`,
      issuer: issuerUrl,
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}
