import { Controller, Get, Req, Post, Body, OnModuleInit, UseGuards, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Client, Transport, ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';

import msClientOptions from '../micro-service-session/client';
import { MicroServiceSession } from '../micro-service-session/micro-service-session.controller';
import { UserOutputDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';

const logger = new Logger('Controller');

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
  @UseGuards(AuthGuard('jwt'))
  @ApiUseTags('Protected API')
  @Get('/request/headers')
  public getRequestHeader(@Req() req: Request) {
    logger.log(req.user);
    return req.headers;
  }
}
