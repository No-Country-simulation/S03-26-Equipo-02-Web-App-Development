import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entitys/message.entity';
import { ChannelType } from '../entitys/enums/channel-type.enum';

@Controller('messages')
export class MessagesController {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  /**
   * GET /messages
   * Lista todos los mensajes del sistema (WhatsApp + Email) ordenados por fecha descendente.
   */
  @Get()
  async findAll() {
    return this.messageRepo.find({
      relations: ['contact', 'channel'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * GET /messages/whatsapp
   * Lista solo los mensajes recibidos/enviados por WhatsApp.
   */
  @Get('whatsapp')
  async findWhatsApp() {
    return this.messageRepo.find({
      where: { channel: { type: ChannelType.WHATSAPP } },
      relations: ['contact', 'channel'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * GET /messages/email
   * Lista solo los mensajes (emails) recibidos/enviados por Brevo.
   */
  @Get('email')
  async findEmail() {
    return this.messageRepo.find({
      where: { channel: { type: ChannelType.EMAIL } },
      relations: ['contact', 'channel'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * GET /messages/contact/:contactId
   * Lista historial de conversación completo de un contacto específico (multicanal).
   */
  @Get('contact/:contactId')
  async findByContact(@Param('contactId', ParseUUIDPipe) contactId: string) {
    return this.messageRepo.find({
      where: { contact: { id: contactId } },
      relations: ['contact', 'channel'],
      order: { createdAt: 'DESC' },
    });
  }
}
