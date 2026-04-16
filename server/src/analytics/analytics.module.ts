import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'src/entitys/contact.entity';
import { Message } from 'src/entitys/message.entity';
import { Task } from 'src/entitys/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Message, Task])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
