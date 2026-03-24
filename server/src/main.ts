import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  //
  const logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  app.useLogger(logLevels);
  app.enableCors({
    origin: `"*"`,
    credentials: true,
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
  });
  //
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(config.get<number>('PORT', 3000));
  Logger.log(`Server is running on port ${config.get<number>('PORT', 3000)}`);
}

bootstrap().catch((err) => {
  Logger.log(`"Global error handler"`);
  Logger.log(err);
  Logger.log(`"----------------------------------------------------------"`);
});
