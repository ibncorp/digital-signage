import { BaseEntityDto } from 'src/model/dto/base.dto';

export interface MediaDTO extends BaseEntityDto {
  fileName: string;
  displayName: string;
  mimeType: string;
  path: string;
  description: string;
  type: number;
}
