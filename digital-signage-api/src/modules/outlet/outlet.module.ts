import { Outlet } from '../../model/outlet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletController } from './outlet.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outlet]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
  ],

  controllers: [OutletController],
  providers: [OutletService],
  exports: [OutletService],
})
export class OutletModule {}
