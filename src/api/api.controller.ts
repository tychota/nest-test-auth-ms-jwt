import { Controller, Get, Req, Post, Body, OnModuleInit } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { Client, Transport, ClientGrpc } from '@nestjs/microservices';

import msClientOptions from '../micro-service-session/client';
import { MicroServiceSession } from '../micro-service-session/micro-service-session.controller';
import { UserOutputDto } from './dto/user.dto';

@Controller()
export class ApiController implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: msClientOptions,
  })
  client: ClientGrpc;
  microServiceSession: MicroServiceSession;

  public onModuleInit() {
    this.microServiceSession = this.client.getService<MicroServiceSession>('MicroServiceSession');
  }

  @ApiUseTags('Login')
  @Post('/login')
  public async login(@Body() body: LoginDto): Promise<UserOutputDto> {
    const user = await this.microServiceSession.getAuthenticatedUserByEmailPassword(body);
    return user;
  }

  @ApiBearerAuth()
  @ApiUseTags('Protected API')
  @Get('/request/headers')
  public getRequestHeader(@Req() req: Request) {
    return req.headers;
  }
}
