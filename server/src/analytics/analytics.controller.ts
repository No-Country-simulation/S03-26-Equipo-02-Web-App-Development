import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('messages-over-time')
  getMessagesOverTime() {
    return this.analyticsService.getMessagesOverTime();
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.analyticsService.getRecentActivity();
  }
}
