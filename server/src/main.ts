import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Soporte para application/x-www-form-urlencoded (Twilio)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT')) || 3000;
  const env = config.get<string>('NODE_ENV', 'development');

  const logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  app.useLogger(logLevels);
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port, '0.0.0.0');
  Logger.log(`Server is running on port ${port} [${env}]`);

  // ─── Ngrok: solo en desarrollo ────────────────────────────────────────────
  if (env === 'development' && process.env.USE_NGROK === 'true') {
    try {
      // ngrok se importa dinámicamente para que no afecte el build de producción
      const ngrok = await import('@ngrok/ngrok');

      const ngrokToken = config.get<string>('NGROK_AUTHTOKEN');
      if (!ngrokToken) {
        Logger.warn(
          '[Ngrok] NGROK_AUTHTOKEN no está definido en .env — saltando tunnel',
        );
        return;
      }

      const url = await ngrok.connect({
        addr: port,
        authtoken: ngrokToken,
      });

      Logger.log(`[Ngrok] Túnel activo: ${url}`);
      Logger.log(`[Ngrok] Webhook Twilio → ${url}/twilio/webhook`);
      Logger.warn(
        '[Ngrok] Recordá actualizar el Webhook URL en Twilio Console con la URL de arriba',
      );
    } catch (err) {
      Logger.error('[Ngrok] No se pudo iniciar el túnel:', err?.message);
      Logger.warn(
        '[Ngrok] Ejecutá: npm install @ngrok/ngrok --save-dev',
      );
    }
  }
}

bootstrap().catch((err) => {
  Logger.log(`"Global error handler"`);
  Logger.log(err);
  Logger.log(`"----------------------------------------------------------"`);
});
