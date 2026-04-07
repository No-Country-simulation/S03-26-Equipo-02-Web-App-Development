import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioService } from './twilio.service';
import { TwilioController } from './twilio.controller';
import { Contact } from '../entitys/contact.entity';
import { Message } from '../entitys/message.entity';
import { Channel } from '../entitys/channel.entity';
import { WhatsAppQueueModule } from './whatsapp-queue.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Contact, Message, Channel]),
    WhatsAppQueueModule,
  ],
  providers: [TwilioService],
  controllers: [TwilioController],
  exports: [TwilioService],
})
export class TwilioModule {}
