import { ContentCreateDTO } from '../../model/dto/content/content-create.dto';
import {
  convertToCreateContent,
  toContentDto,
  toContentDtoList,
} from '../../shared/mapper';
import { ContentDTO } from '../../model/dto/content/content.dto';
import { Content } from '../../model/content.entity';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusConstants } from '../../shared/constants';
import { DeviceService } from '../device/device.service';
import { MediaService } from '../media/media.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepo: Repository<Content>,
    private deviceService: DeviceService,
    @Inject(forwardRef(() => MediaService))
    private mediaService: MediaService,
    @Inject('MQTT_SERVICE') 
    private client: ClientProxy
  ) {}

  async showAll(type: string, deviceId: string): Promise<ContentDTO[]> {

    const whereArgs = {
      status: StatusConstants.ACTIVE,
    };

    if(type){
      whereArgs['type'] = type;
    }


    if(deviceId){
      whereArgs['device'] = deviceId;
    }

    return toContentDtoList(
      await this.contentRepo.find({
        where: whereArgs,
        relations: ['device', 'media'],
      }),
    );
  }

  async isMediaUsed(mediaId: string): Promise<boolean> {

    const content = await this.contentRepo.find({
      where: {
        status: StatusConstants.ACTIVE,
        media: mediaId
      },
      relations: ['media'],
    });
    return (content.length > 0);
  }

  async read(id: string): Promise<ContentDTO> {
    return toContentDto(
      await this.contentRepo.findOne({
        where: { 
          id, status: StatusConstants.ACTIVE,
        },
        relations: ['device', 'media'],
      }),
    );
  }

  async findById(id: string): Promise<Content> {
    return await this.contentRepo.findOne({
      where: { 
        id,
      },
      relations: ['device', 'media'],
    });
  }

  async create(data: ContentCreateDTO) {
    const objEntity = await convertToCreateContent(data, this.deviceService, this.mediaService);

    const content = this.contentRepo.create(objEntity);
    await this.contentRepo.save(content);

    this.client
      .send('digital-signage/event/' + data?.deviceId, 'on_change_content')
      .subscribe();

    return toContentDto(content);
  }

  async update(id: string, data: Partial<ContentCreateDTO>) {
    const objEntity = await this.findById(id);
    if (!objEntity) {
      throw new HttpException('Content Not Found', HttpStatus.NOT_ACCEPTABLE);
    }

    objEntity.status = data?.status ?? objEntity.status;
    objEntity.type = data?.type ?? objEntity.type;
    objEntity.device = await this.deviceService.findById(data?.deviceId) ?? objEntity.device;
    objEntity.media = await this.mediaService.findById(data?.mediaId) ?? objEntity.media;

    await this.contentRepo.update({ id }, objEntity);

    this.client
      .send('digital-signage/event/' + data?.deviceId, 'on_change_content')
      .subscribe();

    return toContentDto(await this.findById(id));
  }

  async destroy(id: string) {
    const content = await this.findById(id);
    content.status = StatusConstants.NOT_ACTIVE;
   
    await this.contentRepo.update(
      { 
        id 
      }, 
      content
    );

    this.client
      .send('digital-signage/event/' + content.device?.id, 'on_change_content')
      .subscribe();

    return { deleted: true };
  }
}
