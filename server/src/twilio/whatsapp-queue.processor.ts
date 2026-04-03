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

@Processor('whatsapp-messages')
export class WhatsAppQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(WhatsAppQueueProcessor.name);

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { phone, content, profileName } = job.data;

    this.logger.log(`Procesando mensaje de ${phone}: ${content}`);

    // 1. Buscar o crear el Contact por teléfono
    let contact = await this.contactRepo.findOne({ where: { phone } });
    if (!contact) {
      contact = this.contactRepo.create({
        firstName: profileName || phone,
        lastName: '',
        phone,
        segmentType: SegmentType.LEAD,
      });
      contact = await this.contactRepo.save(contact);
      this.logger.log(`Nuevo contacto creado desde cola: ${contact.id}`);
    }

    // 2. Obtener o crear el canal WhatsApp
    let channel = await this.channelRepo.findOne({
      where: { type: ChannelType.WHATSAPP },
    });
    if (!channel) {
      channel = this.channelRepo.create({ type: ChannelType.WHATSAPP });
      channel = await this.channelRepo.save(channel);
    }

    // 3. Guardar el mensaje recibido
    const message = this.messageRepo.create({
      contact,
      channel,
      content,
      direction: 'received',
      status: MessageStatus.RECEIVED,
      isRead: false,
    });
    await this.messageRepo.save(message);

    this.logger.log(`Mensaje guardado desde cola: ${message.id}`);
    return { success: true, messageId: message.id };
  }
}
