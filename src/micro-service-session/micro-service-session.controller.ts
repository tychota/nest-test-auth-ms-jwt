import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { EmailPasswordCredentialsInputDto } from './dto/EmailPasswordCredentials.dto';
import { UserOutputDto, UserInputDto } from './dto/User.dto';

import { User } from './entities/user';

@Controller()
export class MicroServiceSession {
  private logger: Logger;

  public constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {
    this.logger = new Logger('µS Session');
  }

  @GrpcMethod()
  async getAuthenticatedUserByEmailPassword(credentials: EmailPasswordCredentialsInputDto): Promise<UserOutputDto> {
    this.logger.log('Received call on "getAuthenticatedUserByEmailPassword"');
    const userThatMatchEmail = await this.userRepo.findOne({ where: { email: credentials.email } });
    if (!userThatMatchEmail) {
      this.logger.warn('No user matching email');
      throw new RpcException({ code: 7, message: 'Unauthorized' });
    }

    const isValid = await argon2.verify(userThatMatchEmail.hashedPassword, credentials.clearPassword);
    if (!isValid) {
      this.logger.warn('Wrong password');
      throw new RpcException({ code: 7, message: 'Unauthorized' });
    }

    this.logger.log('Call on "getAuthenticatedUserByEmailPassword" handled');

    return userThatMatchEmail;
  }

  @GrpcMethod()
  async createUser({ clearPassword, ...userFields }: UserInputDto): Promise<{}> {
    this.logger.log('Received call on "createUser"');

    const hashedPassword = await argon2.hash(clearPassword);
    try {
      await this.userRepo.save({ hashedPassword, ...userFields });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new RpcException({ code: 6, message: 'Already an user with this email' });
      }
      throw err;
    }

    this.logger.log('Call on "createUser" handled');
    return {};
  }
}
