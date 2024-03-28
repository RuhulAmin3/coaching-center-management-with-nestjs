import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(payload) {
    await this.mailerService.sendMail({
      from: payload.from, // sender address
      to: payload.to, // receivers list or single address
      subject: payload.subject, // Subject line
      html: payload.html,
    });
  }
}
