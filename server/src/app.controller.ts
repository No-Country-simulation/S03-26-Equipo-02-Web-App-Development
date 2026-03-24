import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET /health
   * Verifica que el servidor esté corriendo.
   */
  @Get()
  checkServer(): object {
    return this.appService.checkServer();
  }

  /**
   * GET /health/db
   * Verifica la conexión con PostgreSQL.
   */
  @Get('db')
  async checkDatabase(): Promise<object> {
    return this.appService.checkDatabase();
  }

  /**
   * GET /health/redis
   * Verifica la conexión con Redis.
   */
  @Get('redis')
  async checkRedis(): Promise<object> {
    return this.appService.checkRedis();
  }
}
