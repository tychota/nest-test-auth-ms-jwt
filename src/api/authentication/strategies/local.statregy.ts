import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import * as passport from 'passport';
import { Transport, Client, ClientGrpc } from '@nestjs/microservices';

import msClientOptions from '../../../micro-service-session/client';
import { MicroServiceSession } from '../../../micro-service-session/micro-service-session.controller';

const logger = new Logger('EmailPasswordStrategy');

@Injectable()
export class LocalStrategy extends passport.Strategy {
  @Client({
    transport: Transport.GRPC,
    options: msClientOptions,
  })
  client: ClientGrpc;
  microServiceSession: MicroServiceSession;

  name = 'emailPassword';

  public onModuleInit() {
    this.microServiceSession = this.client.getService<MicroServiceSession>('MicroServiceSession');
  }
  public constructor() {
    super();

    passport.use(this.name, this);
  }

  public async authenticate(request: Request, options?: any) {
    const body = await request.body;

    if (!body.email) {
      this.fail('No email');
      logger.warn('No; email');
      return;
    }

    if (!body.clearPassword) {
      this.fail('No clearPassword');
      logger.warn('No; clearPassword');
      return;
    }

    try {
      const user = await this.microServiceSession.getAuthenticatedUserByEmailPassword(body);
      this.success(user);
    } catch (err) {
      this.fail('No clearPassword');
      logger.warn('No; clearPassword');
      return;
    }
  }
}
