import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WhatsAppQueueProcessor } from './whatsapp-queue.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../entitys/contact.entity';
import { Message } from '../entitys/message.entity';
import { Channel } from '../entitys/channel.entity';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'whatsapp-messages',
    }),
    TypeOrmModule.forFeature([Contact, Message, Channel]),
    ContactsModule,
  ],
  providers: [WhatsAppQueueProcessor],
  exports: [BullModule],
})
export class WhatsAppQueueModule {}
