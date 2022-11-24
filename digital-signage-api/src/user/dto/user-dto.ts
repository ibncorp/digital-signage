import { BaseEntityDto } from '../../model/dto/base.dto';
export interface UserDTO extends BaseEntityDto {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}
