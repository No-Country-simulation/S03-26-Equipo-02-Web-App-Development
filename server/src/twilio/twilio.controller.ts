// twilio.controller.ts
import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwilioService } from './twilio.service';
import { Contact } from '../entitys/contact.entity';
import { Message } from '../entitys/message.entity';
import { Channel } from '../entitys/channel.entity';
import { MessageStatus } from '../entitys/enums/message-status.enum';
import { ChannelType } from '../entitys/enums/channel-type.enum';
import { SegmentType } from '../entitys/enums/segment-type.enum';

@Controller('twilio')
export class TwilioController {
  private readonly logger = new Logger(TwilioController.name);

  constructor(
    private readonly twilioService: TwilioService,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {}

  /**
   * POST /twilio/webhook
   * Recibe mensajes entrantes de WhatsApp desde Twilio.
   * Twilio espera una respuesta 200 (puede ser TwiML vacío o texto plano).
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleIncoming(@Body() body: any) {
    const rawFrom: string = body.From ?? ''; // ej: whatsapp:+5493755349625
    const content: string = body.Body ?? '';
    const phone = rawFrom.replace('whatsapp:', '').trim();

    this.logger.log(`Mensaje entrante de ${phone}: "${content}"`);

    if (!phone || !content) return '';

    // 1. Buscar o crear el Contact por teléfono
    let contact = await this.contactRepo.findOne({ where: { phone } });
    if (!contact) {
      contact = this.contactRepo.create({
        firstName: phone, // se puede mejorar si Twilio envía ProfileName
        lastName: '',
        phone,
        segmentType: SegmentType.LEAD,
      });
      contact = await this.contactRepo.save(contact);
      this.logger.log(`Nuevo contacto creado: ${contact.id}`);
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

    this.logger.log(`Mensaje guardado: ${message.id}`);

    // Twilio requiere respuesta vacía o TwiML — con string vacío alcanza
    return '';
  }

  /**
   * POST /twilio/send
   * Envía un mensaje de WhatsApp a un contacto.
   * Body: { to: "+5493755349625", body: "Hola!" }
   */
  @Post('send')
  async sendMessage(@Body() dto: { to: string; body: string }) {
    const result = await this.twilioService.sendMessage(dto.to, dto.body);
    return { sid: result.sid, status: result.status };
  }

  /**
   * POST /twilio/send-template
   * Envía un mensaje usando un Content Template de Twilio.
   * Body: { to: "+5493755349625", contentSid: "HX...", variables: { "1": "valor" } }
   */
  @Post('send-template')
  async sendTemplate(
    @Body() dto: { to: string; contentSid: string; variables: Record<string, string> },
  ) {
    const result = await this.twilioService.sendTemplate(
      dto.to,
      dto.contentSid,
      dto.variables,
    );
    return { sid: result.sid, status: result.status };
  }
}