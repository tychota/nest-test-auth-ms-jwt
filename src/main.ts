import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';

import * as path from 'path';

import { ApiModule } from './api/api.module';
import { MicroServiceSessionModule } from './micro-service-session/micros-service-session.module';

// tslint:disable-next-line: no-empty
const noop = () => {};

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  const msSession = await NestFactory.createMicroservice(MicroServiceSessionModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:50501',
      package: 'session',
      protoPath: path.join(__dirname, '..', 'proto', 'session.proto'),
    },
  });
  msSession.useGlobalPipes(new ValidationPipe());
  msSession.useGlobalInterceptors(new ClassSerializerInterceptor(msSession.get(Reflector)));

  await msSession.listen(noop);
  await api.listen(3000);
}
bootstrap();
