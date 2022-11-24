import { UserRolesDTO } from '../../model/dto/user-roles/user-roles.dto';
import { BaseEntityDto } from '../../model/dto/base.dto';

export interface UserFullDTO extends BaseEntityDto {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  userRoles: UserRolesDTO[];
}
