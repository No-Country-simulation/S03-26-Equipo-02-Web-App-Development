import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'src/entitys/contact.entity';
import { Task } from 'src/entitys/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Contact])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
