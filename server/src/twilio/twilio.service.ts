// twilio.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;
  private readonly from: string;
  private readonly logger = new Logger(TwilioService.name);

  constructor(private readonly config: ConfigService) {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    this.from = this.config.get<string>('TWILIO_WHATSAPP_FROM')!;

    if (!accountSid || !authToken || !this.from) {
      throw new Error(
        'Twilio config incompleto. Verificá TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN y TWILIO_WHATSAPP_FROM en el .env',
      );
    }

    this.client = Twilio(accountSid, authToken);
    this.logger.log(`Twilio inicializado con número: ${this.from}`);
  }

  /**
   * Envía un mensaje de texto plano por WhatsApp a un contacto.
   * @param to Número destino sin prefijo, ej: +5493755349625
   * @param body Texto del mensaje
   */
  async sendMessage(to: string, body: string) {
    const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    return this.client.messages.create({
      from: this.from,
      to: toFormatted,
      body,
    });
  }

  /**
   * Envía un mensaje usando una plantilla (Content Template) de Twilio.
   * @param to Número destino sin prefijo, ej: +5493755349625
   * @param contentSid SID del template en Twilio, ej: HXb5b62575e6e4ff6129ad7c8efe1f983e
   * @param variables Variables del template, ej: { "1": "12/1", "2": "3pm" }
   */
  async sendTemplate(
    to: string,
    contentSid: string,
    variables: Record<string, string>,
  ) {
    const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    return this.client.messages.create({
      from: this.from,
      to: toFormatted,
      contentSid,
      contentVariables: JSON.stringify(variables),
    });
  }
}