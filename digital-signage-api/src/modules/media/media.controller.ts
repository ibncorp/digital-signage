import { Body, Controller, Delete, forwardRef, Get, Header, HttpStatus, Inject, NotFoundException, Param, Post, Put, Query, StreamableFile, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { MediaCreateDTO } from "src/model/dto/media/media-create.dto";
import { ErrorResponse } from "src/model/dto/response/error-response.dto";
import { SuccessResponse } from "src/model/dto/response/sucess-response.dto";
import { MediaService } from "./media.service";

@Controller('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async showAll(@Query('type') type: string) {
    return new SuccessResponse(HttpStatus.OK, 'OK', await this.mediaService.showAll(type));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() data: Partial<MediaCreateDTO>,
    @UploadedFile() file: Express.Multer.File) {

    return new SuccessResponse(HttpStatus.OK, 'Media added successfully', await this.mediaService.create(file, data));
  }

  @Get('download/:filename')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  getFile(@Param('filename') filename: string): StreamableFile {
    try {
      const file = createReadStream(join(process.cwd(), 'public/', filename));
      return new StreamableFile(file);
    } catch (e) {
      throw new NotFoundException('No such file or directory');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async read(@Param('id') id: string) {
    return new SuccessResponse(HttpStatus.OK, 'OK', await this.mediaService.read(id));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<MediaCreateDTO>,
    @UploadedFile() file: Express.Multer.File
  ) {

    return new SuccessResponse(HttpStatus.OK, 'Media updated successfully', await this.mediaService.update(id, file, data));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.mediaService.destroy(id);

    if (!success) {
      return new ErrorResponse(HttpStatus.OK, 'Media not found or being used');
    }

    return new SuccessResponse(HttpStatus.OK, 'Media deleted successfully');
  }
}
