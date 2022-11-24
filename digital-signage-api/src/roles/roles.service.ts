import { RoleUpdateDTO } from './../model/dto/roles/role-update.dto';
import { convertToCreateRole, toRoleDto } from './../shared/mapper';
import { RoleCreateDTO } from './../model/dto/roles/role-create.dto';
import { RolesDTO } from './../model/dto/roles/role.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../model/role.entity';
import { toRoleDtoList } from '../shared/mapper';
import { StatusConstants } from 'src/shared/constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async showAll(): Promise<RolesDTO[]> {
    return toRoleDtoList(
      await this.rolesRepository.find({
        where: {
          status: StatusConstants.ACTIVE,
        },
      }),
    );
  }

  async read(id: string): Promise<RolesDTO> {
    return toRoleDto(
      await this.rolesRepository.findOne({
        where: { id: id, status: StatusConstants.ACTIVE },
      }),
    );
  }

  async findById(id: string): Promise<Role> {
    return await this.rolesRepository.findOne({
      where: { id },
    });
  }

  async create(data: RoleCreateDTO) {
    const objEntity = convertToCreateRole(data);

    const role = this.rolesRepository.create(objEntity);
    await this.rolesRepository.save(role);
    return toRoleDto(role);
  }

  async update(id: string, data: Partial<RoleUpdateDTO>) {
    const objEntity = await this.findById(id);
    if (!objEntity) {
      throw new HttpException('Roles Not Found', HttpStatus.NOT_ACCEPTABLE);
    }
    objEntity.rolename = data?.roleName;
    objEntity.status = data?.status;
    await this.rolesRepository.update({ id }, objEntity);
    return toRoleDto(await this.rolesRepository.findOne({ where: { id } }));
  }

  async destroy(id: string) {
    const role = await this.rolesRepository.findOne({ id });
    role.status = StatusConstants.NOT_ACTIVE;
    await this.rolesRepository.update({ id }, role);
    return { deleted: true };
  }
}
