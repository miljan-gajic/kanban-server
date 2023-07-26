import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // This is one way to put dependencies in main for something you use globally
  // const reflector = new Reflector()
  // app.useGlobalGuards(new JwtGuard(reflector));

  app.enableCors({
    origin: configService.get('BASE_URL'),
  });
  await app.listen(3500);
}
bootstrap();
