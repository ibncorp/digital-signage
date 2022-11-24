import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserRoleModule } from './user-role/user-role.module';
import { RolesModule } from './roles/roles.module';
import { OutletModule } from './modules/outlet/outlet.module';
import { DeviceModule } from './modules/device/device.module';
import { MediaModule } from './modules/media/media.module';
import { ContentModule } from './modules/content/content.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
    CoreModule,
    UserRoleModule,
    RolesModule,
    OutletModule,
    DeviceModule,
    MediaModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
