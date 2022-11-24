import { UserCreateDTO } from '../user/dto/user-create.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationStatus } from './interface/registration-status.interface';
import { LoginUserDto } from './dto/userlogin.dto';
import { LoginStatus } from './interface/login-status.interface';
import { JwtPayload } from './interface/payload.interface';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SuccessResponse } from 'src/model/dto/response/sucess-response.dto';
import { ErrorResponse } from 'src/model/dto/response/error-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: UserCreateDTO,
  ): Promise<any> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    createUserDto.password = hash;
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      return new ErrorResponse(HttpStatus.BAD_REQUEST, result.message);
    }

    return new SuccessResponse(HttpStatus.CREATED, result.message);
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    return new SuccessResponse(HttpStatus.OK, 'Login Success', await this.authService.login(loginUserDto));
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  public async testAuth(@Req() req: any): Promise<any> {
    return new SuccessResponse(HttpStatus.OK, 'OK', await req.user);
  }
}
