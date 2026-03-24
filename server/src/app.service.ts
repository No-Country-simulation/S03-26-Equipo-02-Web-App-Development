import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  // ─── Check: servidor ──────────────────────────────────────────────────────
  checkServer(): object {
    return {
      status: 'ok',
      message: 'El servidor está funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? 'development',
    };
  }

  // ─── Check: base de datos ─────────────────────────────────────────────────
  async checkDatabase(): Promise<object> {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        message: 'PostgreSQL conectado correctamente',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'No se pudo conectar a PostgreSQL',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ─── Check: redis ─────────────────────────────────────────────────────────
  async checkRedis(): Promise<object> {
    try {
      const pong = await this.redis.ping();
      return {
        status: pong === 'PONG' ? 'ok' : 'degraded',
        message: pong === 'PONG' ? 'Redis conectado correctamente' : 'Redis respondió de forma inesperada',
        ping: pong,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'No se pudo conectar a Redis',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
