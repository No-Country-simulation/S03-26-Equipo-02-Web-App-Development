import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entitys/contact.entity';
import { Message } from '../entitys/message.entity';
import { Channel } from '../entitys/channel.entity';
import { MessageStatus } from '../entitys/enums/message-status.enum';
import { ChannelType } from '../entitys/enums/channel-type.enum';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class BrevoService implements OnModuleInit {
  private readonly logger = new Logger(BrevoService.name);
  private apiInstance: SibApiV3Sdk.EmailCampaignsApi;
  private transactionalApi: SibApiV3Sdk.TransactionalEmailsApi;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('BREVO_API_KEY');
    if (!apiKey) {
      this.logger.error('No se encontró BREVO_API_KEY en el environment.');
      return;
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = apiKey;

    this.apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
    this.transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();
    this.logger.log('Brevo Service inicializado.');
  }

  /**
   * Crea una campaña de email según el ejemplo provisto.
   */
  async createCampaign(options: {
    name: string;
    subject: string;
    htmlContent: string;
    listIds: number[];
    scheduledAt?: string;
  }) {
    const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
    emailCampaigns.name = options.name;
    emailCampaigns.subject = options.subject;
    emailCampaigns.sender = {
      name: this.config.get('BREVO_SENDER_NAME') || 'CRM Startup',
      email: this.config.get('BREVO_SENDER_EMAIL') || 'no-reply@tuempresa.com',
    };
    emailCampaigns.type = 'classic';
    emailCampaigns.htmlContent = options.htmlContent;
    emailCampaigns.recipients = { listIds: options.listIds };
    if (options.scheduledAt) {
      emailCampaigns.scheduledAt = options.scheduledAt;
    }

    try {
      const data = await this.apiInstance.createEmailCampaign(emailCampaigns);
      this.logger.log(`Campaña creada con éxito ID: ${data.id}`);
      return data;
    } catch (error) {
      this.logger.error('Error al crear campaña en Brevo', error.response?.text || error.message);
      throw error;
    }
  }

  /**
   * Envía un email transaccional (individual) a un contacto.
   */
  async sendTransactionalEmail(options: { to: string; subject: string; htmlContent: string }) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.htmlContent;
    sendSmtpEmail.sender = {
      name: this.config.get('BREVO_SENDER_NAME') || 'CRM Startup',
      email: this.config.get('BREVO_SENDER_EMAIL') || 'no-reply@tuempresa.com',
    };
    sendSmtpEmail.to = [{ email: options.to }];

    try {
      const data = await this.transactionalApi.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Email transaccional enviado a ${options.to} | MessageID: ${data.messageId}`);
      
      // Persistir el mensaje saliente en la BD
      await this.persistOutboundEmail(options.to, options.subject, options.htmlContent, data.messageId);
      
      return data;
    } catch (error) {
      this.logger.error(`Error al enviar email transaccional a ${options.to}`, error.response?.text || error.message);
      throw error;
    }
  }

  /**
   * Helper para guardar emails enviados en la base de datos.
   */
  private async persistOutboundEmail(to: string, subject: string, htmlContent: string, messageId: string) {
    // 1. Buscar/Crear Contacto por email
    let contact = await this.contactRepo.findOne({ where: { email: to } });
    if (!contact) {
      contact = await this.contactRepo.save(
        this.contactRepo.create({
          firstName: 'Nuevo Cliente (Email)',
          lastName: '',
          email: to,
        }),
      );
    }

    // 2. Obtener/Crear Canal EMAIL
    let channel = await this.channelRepo.findOne({ where: { type: ChannelType.EMAIL } });
    if (!channel) {
      channel = await this.channelRepo.save(this.channelRepo.create({ type: ChannelType.EMAIL }));
    }

    // 3. Crear Mensaje
    const content = `[Asunto: ${subject}] ${htmlContent.replace(/<[^>]*>?/gm, '').substring(0, 500)}...`;
    const message = this.messageRepo.create({
      contact,
      channel,
      content,
      direction: 'sent',
      status: MessageStatus.SENT,
      isRead: true, // Nosotros enviamos, ya lo "vimos"
    });

    await this.messageRepo.save(message);
    this.logger.log(`Email saliente persistido en la BD: ${messageId}`);
  }

  /**
   * Procesa eventos de webhooks de Brevo (aperturas, clicks, inbound).
   */
  async processWebhookEvent(payload: any) {
    this.logger.log(`Webhook recibido: ${payload.event} para ${payload.email}`);

    // Si es un evento de apertura
    if (payload.event === 'opened' || payload.event === 'unique_opened') {
      await this.markAsRead(payload.email);
    } 
    // Si es un email entrante (inbound)
    else if (payload.event === 'inbound') {
      await this.handleInboundEmail(payload);
    }

    return { success: true };
  }

  private async markAsRead(email: string) {
    // Buscar el último mensaje enviado a ese email que no esté leído
    const contact = await this.contactRepo.findOne({ where: { email } });
    if (!contact) return;

    const message = await this.messageRepo.findOne({
      where: { contact: { id: contact.id }, status: MessageStatus.SENT },
      order: { createdAt: 'DESC' },
    });

    if (message) {
      message.status = MessageStatus.READ;
      message.isRead = true;
      await this.messageRepo.save(message);
      this.logger.log(`Mensaje marcado como leído para el contacto: ${email}`);
    }
  }

  private async handleInboundEmail(payload: any) {
    const fromEmail = payload.from?.email || payload.sender?.email;
    const content = payload.text || payload.subject;

    let contact = await this.contactRepo.findOne({ where: { email: fromEmail } });
    if (!contact) {
      contact = this.contactRepo.create({
        firstName: payload.from?.name || fromEmail,
        lastName: '',
        email: fromEmail,
      });
      contact = await this.contactRepo.save(contact);
    }

    let channel = await this.channelRepo.findOne({ where: { type: ChannelType.EMAIL } });
    if (!channel) {
      channel = await this.channelRepo.save(this.channelRepo.create({ type: ChannelType.EMAIL }));
    }

    const message = this.messageRepo.create({
      contact,
      channel,
      content,
      direction: 'received',
      status: MessageStatus.RECEIVED,
      isRead: false,
    });

    await this.messageRepo.save(message);
    this.logger.log(`Email entrante guardado de: ${fromEmail}`);
  }
}
