import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RangeDto } from './dto/range.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@Query() query: RangeDto) {
    return this.analyticsService.getDashboardStats(query.range);
  }

  @Get('messages-over-time')
  getMessagesOverTime(@Query() query: RangeDto) {
    return this.analyticsService.getMessagesOverTime(query.range);
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.analyticsService.getRecentActivity();
  }

  @Get('recent-activity/all')
  getAllActivity() {
    return this.analyticsService.getAllActivity();
  }
}
