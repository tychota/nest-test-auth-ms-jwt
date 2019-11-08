import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MicroServiceSession } from './micro-service-session.controller';
import { User } from './entities/user';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'user.db',
      entities: [User],
      synchronize: true,
      logger: 'advanced-console',
      logging: 'all',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [MicroServiceSession],
})
export class MicroServiceSessionModule {}
