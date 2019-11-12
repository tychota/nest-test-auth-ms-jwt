import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from 'nestjs-config';

import * as path from 'path';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.statregy';

const configPath = path.resolve(path.join(process.cwd(), 'config', '**/!(*.d).{js,ts}'));

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule.load(configPath)],
      useFactory: (configService: ConfigService) => {
        return {
          publicKey: configService.get('jwt.publicKey'),
          verifyOptions: { algorithms: ['ES512'], audience: 'HTTP' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, LocalStrategy],
})
export class AuthenticationModule {}
