import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletModule } from 'src/modules/outlet/outlet.module';
import { UserRoleModule } from './../user-role/user-role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OutletModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
