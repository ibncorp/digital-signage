import { BaseEntityDto } from '../base.dto';

export interface OutletSimpleDTO extends BaseEntityDto {
  code: string;
  name: string;
  address: string;
  region: string;
}
