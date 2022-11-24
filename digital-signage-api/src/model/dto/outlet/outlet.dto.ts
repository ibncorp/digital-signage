import { BaseEntityDto } from 'src/model/dto/base.dto';
import { DeviceSimpleDTO } from '../device/device-simple.dto';

export interface OutletDTO extends BaseEntityDto {
  code: string;
  name: string;
  address: string;
  region: string;
  devices: DeviceSimpleDTO[];
}
