import { UserDTO } from '../user/dto/user-dto';
import { UserCreateDTO } from '../user/dto/user-create.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegistrationStatus } from './interface/registration-status.interface';
import { LoginUserDto } from './dto/userlogin.dto';
import { LoginStatus } from './interface/login-status.interface';
import { JwtPayload } from './interface/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserCreateDTO): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err.toString(),
      };
    }

    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.usersService.findByLogin(loginUserDto);

    // generate and sign token
    const token = this._createToken(user);

    return {
      username    : user.username,
      accessToken : token?.accessToken,
      admin       : false,
      expiresIn   : token?.expiresIn,
      authorized  : true,
      email       : user.email,
      fullName    : user.firstname + ' ' + user.lastname,
      newUser     : false,
      remember    : loginUserDto.remember,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDTO> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ email }: UserDTO): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { email };

    const accessToken = this.jwtService.sign(user);

    return {
      expiresIn,
      accessToken,
    };
  }
}
