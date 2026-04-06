// twilio.controller.ts
import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwilioService } from './twilio.service';
import { Contact } from '../entitys/contact.entity';
import { Message } from '../entitys/message.entity';
import { Channel } from '../entitys/channel.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

interface TwilioWebhookBody {
  From?: string;
  Body?: string;
  ProfileName?: string;
}

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
    @InjectQueue('whatsapp-messages')
    private readonly whatsappQueue: Queue,
  ) {}

  /**
   * POST /twilio/webhook
   * Recibe mensajes entrantes de WhatsApp desde Twilio.
   * Agrega el mensaje a la cola para procesamiento asíncrono.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleIncoming(@Body() body: TwilioWebhookBody) {
    const rawFrom = body.From ?? '';
    const content = body.Body ?? '';
    const profileName = body.ProfileName ?? '';
    const phone = rawFrom.replace('whatsapp:', '').trim();

    this.logger.log(`Mensaje recibido de ${phone}, encolando...`);

    if (phone && content) {
      await this.whatsappQueue.add('incoming-message', {
        phone,
        content,
        profileName,
      });
    }

    return '';
  }

  /**
   * GET /twilio/messages
   * Lista todos los mensajes de WhatsApp recibidos/enviados.
   */
  @Get('messages')
  async listAllMessages() {
    return this.messageRepo.find({
      relations: ['contact', 'channel'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * GET /twilio/messages/contact/:phone
   * Lista mensajes de un contacto específico por su número de teléfono.
   */
  @Get('messages/contact/:phone')
  async listMessagesByContact(@Param('phone') phone: string) {
    return this.messageRepo.find({
      where: { contact: { phone } },
      relations: ['contact', 'channel'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * POST /twilio/send
   * Envía un mensaje de WhatsApp a un contacto.
   * Body: { to: "+5493755349625", body: "Hola!" }
   */
  @Post('send')
  async sendMessage(@Body() dto: { to: string; body: string }) {
    try {
      const result = await this.twilioService.sendMessage(dto.to, dto.body);
      return { sid: result.sid, status: result.status };
    } catch (err: any) {
      const twilioMessage = err?.message ?? 'Error desconocido de Twilio';
      const twilioCode = err?.code ?? null;
      this.logger.error(`[send] Error Twilio (code ${twilioCode}): ${twilioMessage}`);
      throw new HttpException(
        {
          success: false,
          error: twilioMessage,
          twilioCode,
          hint: this.getTwilioHint(twilioCode),
        },
        err?.status ?? 502,
      );
    }
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
    try {
      const result = await this.twilioService.sendTemplate(
        dto.to,
        dto.contentSid,
        dto.variables,
      );
      return { sid: result.sid, status: result.status };
    } catch (err: any) {
      const twilioMessage = err?.message ?? 'Error desconocido de Twilio';
      const twilioCode = err?.code ?? null;
      this.logger.error(`[send-template] Error Twilio (code ${twilioCode}): ${twilioMessage}`);
      throw new HttpException(
        {
          success: false,
          error: twilioMessage,
          twilioCode,
          hint: this.getTwilioHint(twilioCode),
        },
        err?.status ?? 502,
      );
    }
  }

  /**
   * Devuelve una sugerencia legible según el código de error de Twilio.
   * Referencia: https://www.twilio.com/docs/api/errors
   */
  private getTwilioHint(code: number | null): string {
    const hints: Record<number, string> = {
      21211: 'El número destino no es válido. Verificá el formato (+549XXXXXXXXXX).',
      21408: 'El número destino no tiene habilitado WhatsApp o no activó el Sandbox. Debe enviar "join <keyword>" al +14155238886 primero.',
      21610: 'El número destino tiene bloqueados los mensajes (opt-out). El contacto debe escribir "START" al número de Twilio.',
      63007: 'WhatsApp no pudo entregar el mensaje. El número puede no estar registrado en WhatsApp.',
      63016: 'La ventana de 24hs expiró. Usá un Content Template (send-template) en lugar de texto libre.',
      20003: 'Credenciales inválidas. Verificá TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN en el .env.',
      20429: 'Límite de solicitudes alcanzado. Esperá unos segundos y reintentá.',
    };
    return code !== null ? (hints[code] ?? `Código Twilio ${code} — ver https://www.twilio.com/docs/api/errors/${code}`) : 'Sin información adicional.';
  }
}
