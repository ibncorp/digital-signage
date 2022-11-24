import { DeviceCreateDTO } from '../../model/dto/device/device-create.dto';
import { DeviceService } from './device.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SuccessResponse } from 'src/model/dto/response/sucess-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get()
  async showAll(@Req() req: any, @Query('type') type: string) {
    const devices = await this.deviceService.showAll(type);
    return new SuccessResponse(HttpStatus.OK, 'OK', devices);
  }

  @Post()
  async create(@Body() data: DeviceCreateDTO) {
    const device = await this.deviceService.create(data);
    return new SuccessResponse(HttpStatus.OK, 'Device added successfully', device);
  }

  @Get(':id')
  async read(@Param('id') id: string) {
    const device = await this.deviceService.read(id);
    return new SuccessResponse(HttpStatus.OK, 'OK', device);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<DeviceCreateDTO>,
  ) {
    const device = await this.deviceService.update(id, data);
    return new SuccessResponse(HttpStatus.OK, 'Device update successfully', device);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deviceService.destroy(id);

    return new SuccessResponse(HttpStatus.OK, 'Device deleted successfully');
  }
}
