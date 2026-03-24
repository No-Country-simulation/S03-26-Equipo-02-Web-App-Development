import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redis } from 'ioredis';

@Module({
  imports: [
    // ─── Config global ───────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ─── PostgreSQL ───────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [],
        synchronize: false, // NUNCA true en producción
        logging: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // ─── Redis (ioredis) ──────────────────────────────────────────────────────
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) => {
        const client = new Redis({
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
          username: config.get<string>('REDIS_USERNAME', 'default'),
          tls: config.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
          lazyConnect: true,
        });

        client.on('error', (err) => {
          console.error('[Redis] Error de conexión:', err.message);
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class AppModule {}
