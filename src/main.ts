import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ApiModule } from './api/api.module';
import { MicroServiceSessionModule } from './micro-service-session/micros-service-session.module';

import msClientOptions from './micro-service-session/client';
import { ErrorHandlingFilter } from './httpErrorHandling';

// tslint:disable-next-line: no-empty
const noop = () => {};

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  api.useGlobalPipes(new ValidationPipe());
  api.useGlobalFilters(new ErrorHandlingFilter());
  api.useGlobalInterceptors(new ClassSerializerInterceptor(api.get(Reflector)));
  const options = new DocumentBuilder()
    .setTitle('Api with auth')
    .setDescription('Test auth')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(api, options);
  SwaggerModule.setup('api', api, document);

  const msSession = await NestFactory.createMicroservice(MicroServiceSessionModule, {
    transport: Transport.GRPC,
    options: msClientOptions,
  });
  msSession.useGlobalPipes(new ValidationPipe());
  msSession.useGlobalInterceptors(new ClassSerializerInterceptor(msSession.get(Reflector)));

  await Promise.race([msSession.listen(noop), api.listen(3000)]);
}
bootstrap();
