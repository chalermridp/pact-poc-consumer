import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseExceptionFilter } from './common/filters/base.exception.filter';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { UnexpectedExceptionFilter } from './common/filters/unexpected.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new UnexpectedExceptionFilter(),
    new HttpExceptionFilter(),
    new BaseExceptionFilter(),
  );
  await app.listen(3001);
}
bootstrap();
