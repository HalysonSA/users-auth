import { MailerService as NestMailer } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export enum EmailTemplates {
  WELCOME = 'welcome',
  TEMP_PASSWORD = 'temp_password',
  RESET_PASSWORD = 'reset_password',
}
export interface EmailProps {
  to: string;
  subject: string;
  template: EmailTemplates;
  context: {
    name: string;
    email: string;
    password?: string;
    resetToken?: string;
  };
}

@Injectable()
export class MailerService {
  constructor(private readonly nestMailer: NestMailer) {}

  async execute(props: EmailProps): Promise<void> {
    const { to, subject, context, template } = props;

    await this.nestMailer.sendMail({
      to,
      from: process.env.SMTP_FROM_EMAIL,
      subject,
      template,
      context,
    });
  }
}
