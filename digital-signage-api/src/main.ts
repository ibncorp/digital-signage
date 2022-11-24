import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configService } from './config/config.service';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { runDbMigrations } from './shared/utils';
import { MulterModule } from '@nestjs/platform-express';
import express from 'express';
import { join } from 'path';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!configService.isProduction()) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Item API')
        .setDescription('Petty Cash API Documentation')
        .setVersion('1.0')
        .addBearerAuth(
          { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          'access-token',
        )
        .build(),
    );
    SwaggerModule.setup('api', app, document);
  }

  app.use(helmet());

  //app.use('/public', express.static(join(__dirname, '..', 'public')));

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Strip away all none-object existing properties
       */
      whitelist: true,
      /***
       * Transform input objects to their corresponding DTO objects
       */
      transform: true,
    }),
  );

  await runDbMigrations();

  await app.listen(port);
}
bootstrap();
