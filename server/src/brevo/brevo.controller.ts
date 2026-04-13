import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { BrevoService } from './brevo.service';

@Controller('brevo')
export class BrevoController {
  private readonly logger = new Logger(BrevoController.name);

  constructor(private readonly brevoService: BrevoService) {}

  /**
   * POST /brevo/campaigns
   * Crea una nueva campaña de email.
   * Body: { name, subject, htmlContent, listIds, scheduledAt? }
   */
  @Post('campaigns')
  async createCampaign(@Body() dto: any) {
    try {
      const result = await this.brevoService.createCampaign(dto);
      return { success: true, campaign: result };
    } catch (error) {
      this.logger.error('Error al crear campaña', error.response?.text || error.message);
      return { success: false, error: error.response?.text || error.message };
    }
  }

  /**
   * POST /brevo/send
   * Envía un email transaccional (individual).
   * Body: { to, subject, htmlContent }
   */
  @Post('send')
  async sendEmail(@Body() dto: { to: string; subject: string; htmlContent: string }) {
    try {
      const result = await this.brevoService.sendTransactionalEmail(dto);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      this.logger.error('Error al enviar email transaccional', error.response?.text || error.message);
      return { success: false, error: error.response?.text || error.message };
    }
  }

  /**
   * POST /brevo/webhooks
   * Recibe eventos de Brevo (aperturas, clicks, inbound).
   * Webhook security: ideally verify the Brevo IP or use a secret token.
   */
  @Post('webhooks')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    return this.brevoService.processWebhookEvent(payload);
  }
}
