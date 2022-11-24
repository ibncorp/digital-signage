import { ContentDTO } from '../../model/dto/content/content.dto';
import { ContentCreateDTO } from '../../model/dto/content/content-create.dto';
import { ContentService } from './content.service';
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
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  async showAll(@Query('type') type: string, @Query('deviceId') deviceId: string) {
    return new SuccessResponse(HttpStatus.OK, 'OK', await this.contentService.showAll(type, deviceId));
  }

  @Post()
  async create(@Body() data: ContentCreateDTO) {
    return new SuccessResponse(HttpStatus.OK, 'Content added successfully', await this.contentService.create(data));
  }

  @Get(':id')
  async read(@Param('id') id: string) {
    return new SuccessResponse(HttpStatus.OK, 'OK', await this.contentService.read(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<ContentCreateDTO>,
  ) {
    return new SuccessResponse(HttpStatus.OK, 'Content update successfully', await this.contentService.update(id, data));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.contentService.destroy(id);

    return new SuccessResponse(HttpStatus.OK, 'Content deleted successfully');
  }
}
