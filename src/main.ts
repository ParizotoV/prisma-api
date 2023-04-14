import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedInterceptor } from './common/erros/interceptors/unauthorized.interceptor';
import { NotFoundInterceptor } from './common/erros/interceptors/notfound.interceptor';
import { ConflitInterceptor } from './common/erros/interceptors/conflict.interceptor';
import { DatabaseInterceptor } from './common/erros/interceptors/database.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Simple blog')
    .setDescription('The Simple Blog API Description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ConflitInterceptor());
  app.useGlobalInterceptors(new DatabaseInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());
  app.useGlobalInterceptors(new NotFoundInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
