import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entitys/contact.entity';
import { Message } from '../entitys/message.entity';
import { Channel } from '../entitys/channel.entity';
import { MessageStatus } from '../entitys/enums/message-status.enum';
import { ChannelType } from '../entitys/enums/channel-type.enum';
import { SegmentType } from '../entitys/enums/segment-type.enum';
import { Logger } from '@nestjs/common';

import { ContactsService } from '../contacts/contacts.service';

@Processor('whatsapp-messages')
export class WhatsAppQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(WhatsAppQueueProcessor.name);

  constructor(
    private readonly contactsService: ContactsService,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { phone, content, profileName, messageSid } = job.data;

    this.logger.log(`Procesando mensaje de ${phone}: ${content} (SID: ${messageSid})`);

    // 1. Buscar o crear el Contact por teléfono usando el servicio centralizado
    const contact = await this.contactsService.findOrCreateByPhone(phone, profileName);

    // 2. Obtener o crear el canal WhatsApp
    let channel = await this.channelRepo.findOne({
      where: { type: ChannelType.WHATSAPP },
    });
    if (!channel) {
      channel = await this.channelRepo.save(this.channelRepo.create({ type: ChannelType.WHATSAPP }));
    }

    // 3. Guardar el mensaje recibido
    const message = this.messageRepo.create({
      contact,
      channel,
      content,
      direction: 'received',
      status: MessageStatus.RECEIVED,
      twilioSid: messageSid,
      isRead: false,
    });
    await this.messageRepo.save(message);

    this.logger.log(`Mensaje entrante guardado: ${message.id} (SID: ${messageSid})`);
    return { success: true, messageId: message.id };
  }
}
