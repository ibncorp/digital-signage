import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { StatusConstants } from 'src/shared/constants';
import { Media } from 'src/model/media.entity';
import { MediaDTO } from 'src/model/dto/media/media.dto';
import { MediaCreateDTO } from 'src/model/dto/media/media-create.dto';
import { toMediaDtoList, toMediaDto } from 'src/shared/mapper';
import { ErrorResponse } from 'src/model/dto/response/error-response.dto';
import { SuccessResponse } from 'src/model/dto/response/sucess-response.dto';
import { ContentService } from '../content/content.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private repo: Repository<Media>,
    @Inject(forwardRef(() => ContentService))
    private contentService: ContentService,
  ) { }

  async showAll(type: string): Promise<MediaDTO[]> {

    const whereArgs = {
      status: StatusConstants.ACTIVE,
    };

    if(type){
      whereArgs['type'] = type;
    }

    return toMediaDtoList(
      await this.repo.find({
        where: whereArgs
      }),
    );
  }

  async read(id: string): Promise<MediaDTO> {
    return toMediaDto(
      await this.repo.findOne({
        where: { id, status: StatusConstants.ACTIVE }
      }),
    );
  }

  async findById(id: string): Promise<Media> {
    return await this.repo.findOne({
      where: { id },
    });
  }

  async create(file: Express.Multer.File, data: Partial<MediaCreateDTO>) {

    const objEntity = new Media();

    objEntity.status = data.status;
    objEntity.fileName = file.filename;
    objEntity.displayName = data.displayName;
    objEntity.mimeType = file.mimetype;
    objEntity.path = file.path;
    objEntity.description = data.description;
    objEntity.type = data.type;

    const entity = this.repo.create(objEntity);

    await this.repo.save(entity);

    return toMediaDto(entity);
  }

  async update(id: string, file: Express.Multer.File, data: Partial<MediaCreateDTO>) {
    const objEntity = await this.findById(id);
    if (!objEntity) {
      throw new HttpException(
        'Media Not Found',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    objEntity.status = data?.status ?? objEntity.status;
    objEntity.fileName = file?.filename ?? objEntity.fileName;
    objEntity.displayName = data?.displayName ?? objEntity.displayName;
    objEntity.mimeType = file?.mimetype ?? objEntity.mimeType;
    objEntity.path = file?.path ?? objEntity.path;
    objEntity.description = data?.description ?? objEntity.description;
    objEntity.type = data?.type ?? objEntity.type;

    await this.repo.update({ id }, objEntity);
    return toMediaDto(
      await this.repo.findOne({
        where: { id },
      }),
    );
  }

  async destroy(id: string) {
    const media = await this.repo.findOne({ id });

    // Check if media exist
    if(!media) {
      return false;
    }

    // Check if media used
    if(await this.contentService.isMediaUsed(id)){
      return false
    }

    media.status = StatusConstants.NOT_ACTIVE;
    await this.repo.update({ id }, media);

    return true;
  }
}

