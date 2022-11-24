import { Device } from '../../model/device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { PassportModule } from '@nestjs/passport';
import { OutletModule } from '../outlet/outlet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    OutletModule,
  ],

  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
