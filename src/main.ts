import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip extra properties
    forbidNonWhitelisted: true, // Throw error if extra properties
  }));
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
  });
  await app.listen(8083);
}
bootstrap();