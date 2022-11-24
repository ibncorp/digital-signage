import { UserRoleCreateDTO } from './../model/dto/user-roles/user-roles-create.dto';
import { UserRoleService } from './user-role.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('user-role')
export class UserRoleController {
  constructor(private userRolesService: UserRoleService) {}

  @Get()
  async showAll() {
    return {
      message: 'OK',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.userRolesService.showAll(),
      },
    };
  }

  @Get('/filter?')
  async showAllUsingFilter(@Query('roleId') roleId?: string, @Query('userId') userId?: string) {
    return {
      message: 'OK',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.userRolesService.showAllUsingFilter(roleId, userId),
      },
    };
  }

  /*
  @Get('/filter?')
  async showAllByFilter(@Query('roleId') roleId: string) {
    console.log("Test");
    return {
      message: 'OK',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.userRolesService.showAllByRoleId(roleId),
      },
    };
  }

  @Get('/filter?')
  async showAllByUserId(@Query('userId') userId: string) {
    return {
      message: 'OK',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.userRolesService.showAllByUserId(userId),
      },
    };
  }
  */
  @Post()
  async createUsers(@Body() data: UserRoleCreateDTO) {
    return {
      message: 'User Role added successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.userRolesService.create(data),
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
        data: await this.userRolesService.read(id),
      },
    };
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<UserRoleCreateDTO>,
  ) {
    return {
      message: 'User Role update successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.userRolesService.update(id, data),
      },
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userRolesService.destroy(id);
    return {
      message: 'User Role deleted successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: [],
      },
    };
  }
}
