import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('User Management & Auth API')
    .setDescription('조직 및 회원 관리, JWT 인증 시스템 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
