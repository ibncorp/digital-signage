import { OutletDTO } from '../outlet/outlet.dto';
import { BaseEntityDto } from 'src/model/dto/base.dto';

export interface DeviceSimpleDTO extends BaseEntityDto {
  code: string;
  name: string;
  type: number;
  description: string;
}
