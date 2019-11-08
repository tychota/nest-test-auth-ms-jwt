import { Module } from '@nestjs/common';
import { MicroServiceSession } from './micro-service-session.controller';

@Module({
  imports: [],
  controllers: [MicroServiceSession],
})
export class MicroServiceSessionModule {}
