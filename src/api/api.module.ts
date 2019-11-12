import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [ApiController],
})
export class ApiModule {}
