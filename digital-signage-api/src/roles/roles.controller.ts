import { RoleUpdateDTO } from './../model/dto/roles/role-update.dto';
import { RolesDTO } from './../model/dto/roles/role.dto';
import { RoleCreateDTO } from './../model/dto/roles/role-create.dto';
import { RolesService } from './roles.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get()
  async showAllUsers() {
    return {
      message: 'OK',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.roleService.showAll(),
      },
    };
  }

  @Post()
  async createUsers(@Body() data: RoleCreateDTO) {
    return {
      message: 'Role added successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.roleService.create(data),
      },
    };
  }

  @Get(':id')
  async readUser(@Param('id') id: string) {
    return {
      message: 'OK',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.roleService.read(id),
      },
    };
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<RoleUpdateDTO>,
  ) {
    return {
      message: 'Role update successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.roleService.update(id, data),
      },
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.roleService.destroy(id);
    return {
      message: 'Role deleted successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: [],
      },
    };
  }
}
