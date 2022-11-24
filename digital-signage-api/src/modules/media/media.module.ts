import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media } from 'src/model/media.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: 'public',
      }),
    }),
    TypeOrmModule.forFeature([Media]),
    forwardRef(() => ContentModule)
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
