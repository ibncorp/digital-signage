import { OutletService } from '../modules/outlet/outlet.service';
import {
  convertToUser,
  toUserDto,
  toUserRoleDtoList,
} from './../shared/mapper';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from 'src/auth/dto/userlogin.dto';
import { comparePasswords } from '../shared/utils';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserDTO } from './dto/user-dto';
import { StatusConstants } from 'src/shared/constants';
import { UserFullDTO } from './dto/user-full.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly outletService: OutletService,
  ) {}

  async showAll(): Promise<UserFullDTO[]> {
    return this.toDtoListFull(
      await this.usersRepository.find({
        where: {
          status: StatusConstants.ACTIVE,
        },
        relations: ['userRoles'],
      }),
    );
  }

  async create(data: UserCreateDTO) {
    if (await this.findByUsernameAndEmail(data.username, data.email)) {
      throw new HttpException(
        'User already registered',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const userEntity = convertToUser(data);
    userEntity.status = StatusConstants.ACTIVE;
    userEntity.password = data.password;

    const user = this.usersRepository.create(userEntity);
    await this.usersRepository.save(user);
    return toUserDto(user);
  }

  async findByLogin({
    email,
    password,
  }: LoginUserDto): Promise<UserFullDTO> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.toDtoFull(user);
  }

  async findByPayload({ email }: any): Promise<UserDTO> {
    return this.toDtoFull(await this.usersRepository.findOne({
      where: { email: email },
      relations: ['userRoles'],
    }));
  }

  async read(id: string): Promise<UserFullDTO> {
    return this.toDtoFull(
      await this.usersRepository.findOne({
        where: { id: id },
        relations: ['userRoles'],
      }),
    );
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async findByUsernameAndEmail(username: string, email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: [
        {
          username: username,
          status: StatusConstants.ACTIVE,
        },
        {
          email: email,
          status: StatusConstants.ACTIVE,
        },
      ],
    });
  }

  async update(id: string, data: Partial<UserCreateDTO>) {
    const objEntity = await this.findById(id);
    if (!objEntity) {
      throw new HttpException('User Not Found', HttpStatus.NOT_ACCEPTABLE);
    }
    objEntity.email = data?.email;
    objEntity.firstname = data?.firstname;
    objEntity.lastname = data?.lastname;
    objEntity.username = data?.username;

    await this.usersRepository.update({ id }, objEntity);
    return this.toDto(await this.usersRepository.findOne({ id }));
  }

  async destroy(id: string) {
    this.usersRepository.findOne({id})
    const user = await this.usersRepository.findOne(id);
    user.status = StatusConstants.NOT_ACTIVE;
    await this.usersRepository.update({ id }, user);
    return { deleted: true };
  }

  private async toDto(source: User): Promise<UserDTO> {
    const userDto: UserDTO = {
      id: source.id,
      username: source?.username,
      firstname: source?.firstname,
      lastname: source?.lastname,
      email: source?.email,
      status: source?.status,
      createDateTime: source?.createDateTime,
      createdBy: source?.createdBy,
      updateDate: source?.updateDate,
      updateBy: source?.updateBy,
    };
    return userDto;
  }

  private async toDtoFull(source: User): Promise<UserFullDTO> {
    const userDto: UserFullDTO = {
      id: source.id,
      username: source?.username,
      firstname: source?.firstname,
      lastname: source?.lastname,
      email: source?.email,
      status: source?.status,
      createDateTime: source?.createDateTime,
      createdBy: source?.createdBy,
      updateDate: source?.updateDate,
      updateBy: source?.updateBy,
      userRoles: toUserRoleDtoList(source?.userRoles),
    };
    return userDto;
  }

  private async toDtoList(source: User[]): Promise<UserDTO[]> {
    const result: UserDTO[] = [];
    source.map((x) => {
      const userDto: UserDTO = {
        id: x.id,
        username: x.username,
        firstname: x.firstname,
        lastname: x.lastname,
        email: x.email,
        status: x.status,
        createDateTime: x.createDateTime,
        createdBy: x.createdBy,
        updateDate: x.updateDate,
        updateBy: x.updateBy,
      };
      result.push(userDto);
    });
    return result;
  }

  private async toDtoListFull(source: User[]): Promise<UserFullDTO[]> {
    const result: UserFullDTO[] = [];
    
    source.map(async (x) => {

      const userDto: UserFullDTO = {
        id            : x.id,
        username      : x.username,
        firstname     : x.firstname,
        lastname      : x.lastname,
        email         : x.email,
        status        : x.status,
        createDateTime: x.createDateTime,
        createdBy     : x.createdBy,
        updateDate    : x.updateDate,
        updateBy      : x.updateBy,
        userRoles     : toUserRoleDtoList(x?.userRoles),
      };
      
      result.push(userDto);
    });
    return result;
  }
}
