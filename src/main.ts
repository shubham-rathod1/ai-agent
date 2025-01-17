import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // setInterval(() => {
  //   const used = process.memoryUsage();
  //   console.log(`Memory Usage: RSS=${(used.rss / 1024 / 1024).toFixed(2)} MB`);
  // }, 5000);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
