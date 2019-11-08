import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/common/enums/transport.enum';

import * as path from 'path';

import { ApiModule } from './api/api.module';
import { MicroServiceSessionModule } from './micro-service-session/micros-service-session.module';

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  const msSession = await NestFactory.createMicroservice(
    MicroServiceSessionModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'session',
        protoPath: path.join(__dirname, '..', 'proto', 'session.proto'),
      },
    },
  );

  await msSession.listen(() => {});
  await api.listen(3000);
}
bootstrap();
