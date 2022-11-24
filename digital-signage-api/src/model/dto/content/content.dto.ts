import { BaseEntityDto } from 'src/model/dto/base.dto';
import { DeviceDTO } from '../device/device.dto';
import { MediaDTO } from '../media/media.dto';

export interface ContentDTO extends BaseEntityDto {
  type: number;
  device: DeviceDTO;
  media: MediaDTO;
}
