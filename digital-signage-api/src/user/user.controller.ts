import { UserCreateDTO } from './dto/user-create.dto';
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
import { UserDTO } from './dto/user-dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  async showAllUsers() {
    return {
      message: 'OK',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.usersService.showAll(),
      },
    };
  }

  @Post()
  async createUsers(@Body() data: UserCreateDTO){
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password, saltOrRounds);
    data.password = hash;

    return {
      message: 'User added successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.usersService.create(data),
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
        data: await this.usersService.read(id),
      },
    };
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<UserCreateDTO>,
  ) {
    return {
      message: 'User update successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: await this.usersService.update(id, data),
      },
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.destroy(id);
    return {
      message: 'User deleted successfully',
      error: false,
      code: HttpStatus.OK,
      results: {
        data: [],
      },
    };
  }
}
