import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import * as passport from 'passport';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  roles: string[];
}

interface User {
  userId: string;
  roles: string[];
}

const logger = new Logger('JWTStrategy');

@Injectable()
export class JwtStrategy extends passport.Strategy {
  public name: string = 'jwt';

  public constructor(private readonly jwtService: JwtService) {
    super();

    logger.debug('Instantiating JWT strategy with name');
    passport.use(this.name, this as any);
  }

  public authenticate(request: Request, options?: any) {
    logger.debug('Extracting token from request.');
    const token = this.extractToken(request);
    logger.debug('Token is:');
    logger.verbose(token);
    if (!token) {
      return;
    }

    try {
      logger.debug('Verifying JWT...');
      const payload = this.jwtService.verify(token);
      logger.debug('JWT verified.');
      logger.debug('Payload is:');
      logger.verbose(payload);
      try {
        logger.debug('Validating payload:');
        const validatedUser = this.validate(payload);
        if (!validatedUser) {
          logger.warn('No valid user');
          this.fail('No valid user');
          return;
        }
        logger.debug('Payload validated');
        return this.success(validatedUser);
      } catch (validationError) {
        logger.warn(validationError.message);
        this.error(validationError);
      }
    } catch (verificationErr) {
      logger.warn(verificationErr.message);
      this.fail(verificationErr);
    }
  }

  private extractToken(request: Request): string | null {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      logger.warn('No authorization header.');
      this.fail('No authorization header.');
      return null;
    }
    const matches = /^(?<scheme>\S+)\s+(?<token>\S+)$/.exec(authorizationHeader);

    if (!matches) {
      logger.warn('The authHeader must respect the format "<scheme> <token>"');
      this.fail('The authHeader must respect the format "<scheme> <token>"');
      return null;
    }

    if (matches.groups.scheme.toLowerCase() !== 'bearer') {
      logger.warn('The scheme must be "bearer"');
      this.fail('The scheme must be "bearer"');
      return null;
    }

    return matches.groups.token;
  }

  validate(payload: JwtPayload): User | void {
    if (!payload.sub) {
      logger.warn('No "sub" field in this JWT');
      return this.fail('No "sub" field in this JWT');
    }
    if (!payload.roles) {
      logger.warn('No "roles" field in this JWT');
      return this.fail('No "roles" field in this JWT');
    }
    return { userId: payload.sub, roles: payload.roles };
  }
}
