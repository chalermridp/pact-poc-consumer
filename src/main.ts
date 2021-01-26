import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseExceptionFilter } from './common/filters/base.exception.filter';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { UnexpectedExceptionFilter } from './common/filters/unexpected.exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new UnexpectedExceptionFilter(),
    new HttpExceptionFilter(),
    new BaseExceptionFilter(),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3001);
}
bootstrap();
