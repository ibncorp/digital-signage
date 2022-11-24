import { BaseEntityDto } from 'src/model/dto/base.dto';

export interface UserRolesDTO extends BaseEntityDto {
  userId: string;
  userName: string;
  roleId: string;
  roleName: string;
}
