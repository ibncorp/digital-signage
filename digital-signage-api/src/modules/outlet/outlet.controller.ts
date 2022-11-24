import { OutletDTO } from '../../model/dto/outlet/outlet.dto';
import { OutletCreateDTO } from '../../model/dto/outlet/outlet-create.dto';
import { OutletService } from './outlet.service';
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
  UseGuards,
} from '@nestjs/common';
import { SuccessResponse } from 'src/model/dto/response/sucess-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('outlet')
export class OutletController {
  constructor(private outletService: OutletService) {}

  @Get()
  async showAll() {
    return new SuccessResponse(HttpStatus.OK, 'OK', await this.outletService.showAll());
  }

  @Post()
  async create(@Body() data: OutletCreateDTO) {
    return new SuccessResponse(HttpStatus.OK, 'Outlet added successfully', await this.outletService.create(data));
  }

  @Get(':id')
  async read(@Param('id') id: string) {
    return new SuccessResponse(HttpStatus.OK, 'OK', await this.outletService.read(id));    
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<OutletCreateDTO>,
  ) {

    return new SuccessResponse(HttpStatus.OK, 'Outlet update successfully', await this.outletService.update(id, data));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.outletService.destroy(id);

    return new SuccessResponse(HttpStatus.OK, 'Outlet deleted successfully');
  }
}
