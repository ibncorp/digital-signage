import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, MqttRecordBuilder } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) 
  {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
