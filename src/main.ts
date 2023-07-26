import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // This is one way to put dependencies in main for something you use globally
  // const reflector = new Reflector()
  // app.useGlobalGuards(new JwtGuard(reflector));
  await app.listen(3500);
}
bootstrap();
