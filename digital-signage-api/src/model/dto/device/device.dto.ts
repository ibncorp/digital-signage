import { BaseEntityDto } from 'src/model/dto/base.dto';
import { OutletSimpleDTO } from '../outlet/outlet-simple.dto';

export interface DeviceDTO extends BaseEntityDto {
  code: string;
  name: string;
  outlet: OutletSimpleDTO;
  type: number;
  description: string;
}
