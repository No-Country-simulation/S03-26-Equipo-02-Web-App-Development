import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrevoService } from './brevo.service';
import { BrevoController } from './brevo.controller';
import { Contact } from '../entitys/contact.entity';
import { Message } from '../entitys/message.entity';
import { Channel } from '../entitys/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Message, Channel])],
  providers: [BrevoService],
  controllers: [BrevoController],
  exports: [BrevoService],
})
export class BrevoModule {}
