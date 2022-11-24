import { UserService } from './../user/user.service';
import { RolesService } from './../roles/roles.service';
import { UserRolesDTO } from './../model/dto/user-roles/user-roles.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../model/user-role.entity';
import { Repository } from 'typeorm';
import { toUserRoleDto, toUserRoleDtoList } from '../shared/mapper';
import { UserRoleCreateDTO } from '../model/dto/user-roles/user-roles-create.dto';
import { StatusConstants } from 'src/shared/constants';
import { Role } from 'src/model/role.entity';
import { User } from 'src/model/user.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    private readonly roleService: RolesService,
    private readonly userService: UserService,
  ) {}

  async showAll(): Promise<UserRolesDTO[]> {
    return toUserRoleDtoList(
      await this.userRolesRepository.find({
        where: {
          status: StatusConstants.ACTIVE,
        },
        relations: ['user', 'role'],
      }),
    );
  }

  async showAllByUserId(userId: string): Promise<UserRolesDTO[]> {
    return toUserRoleDtoList(
      await this.userRolesRepository.find({
        where: {
          user: await this.userService.findById(userId),
          status: StatusConstants.ACTIVE,
        },
        relations: ['user', 'role'],
      }),
    );
  }

  async showAllByRoleId(roleId: string): Promise<UserRolesDTO[]> {

    const role = await this.roleService.findById(roleId);
    console.log(role);

    return toUserRoleDtoList(
      await this.userRolesRepository.find({
        where: {
          role: role,
          status: StatusConstants.ACTIVE,
        },
        relations: ['user', 'role'],
      }),
    );
  }

  async showAllUsingFilter(roleId?: string, userId?: string): Promise<UserRolesDTO[]> {    
    var whereArgs = {status: StatusConstants.ACTIVE};

    if(roleId){
      whereArgs['role'] = await this.roleService.findById(roleId);
    }

    if(userId){
      whereArgs['user'] = await this.userService.findById(userId);
    }
    
    return toUserRoleDtoList(
      await this.userRolesRepository.find({
        where: whereArgs,
        relations: ['user', 'role'],
      }),
    );
  }

  async create(data: UserRoleCreateDTO) {
    const userRoleEntity = new UserRole();
    userRoleEntity.status = data?.status;
    userRoleEntity.role = await this.roleService.findById(data.roleId);
    userRoleEntity.user = await this.userService.findById(data.userId);

    const userRole = this.userRolesRepository.create(userRoleEntity);
    await this.userRolesRepository.save(userRole);
    return toUserRoleDto(userRole);
  }

  async read(id: string): Promise<UserRolesDTO> {
    return toUserRoleDto(
      await this.userRolesRepository.findOne({
        where: { id: id, status: StatusConstants.ACTIVE },
        relations: ['user', 'role'],
      }),
    );
  }

  async findById(id: string): Promise<UserRole> {
    return await this.userRolesRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<UserRoleCreateDTO>) {
    const objEntity = await this.findById(id);
    if (!objEntity) {
      throw new HttpException('User Role Not Found', HttpStatus.NOT_ACCEPTABLE);
    }
    objEntity.status = data?.status;
    objEntity.role = await this.roleService.findById(data.roleId);
    objEntity.user = await this.userService.findById(data.userId);

    await this.userRolesRepository.update({ id }, objEntity);
    return toUserRoleDto(await this.userRolesRepository.findOne({ id }));
  }

  async destroy(id: string) {
    const user = await this.userRolesRepository.findOne({ id });
    user.status = StatusConstants.NOT_ACTIVE;
    await this.userRolesRepository.update({ id }, user);
    return { deleted: true };
  }
}
