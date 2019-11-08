import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface User {
  userId: number;
  firstName: string;
  lastName: string;
}

@Controller()
export class MicroServiceSession {
  @GrpcMethod()
  getAuthenticatedUserByEmailPassword({ email, password }): User {
    return { userId: 1, firstName: 'Tycho', lastName: 'Tatitscheff' };
  }
}
