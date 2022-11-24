import { RolesModule } from './../roles/roles.module';
import { UserModule } from './../user/user.module';
import { UserRole } from './../model/user-role.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole]), UserModule, RolesModule],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
