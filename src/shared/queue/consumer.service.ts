import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { EmailTemplates, MailerService } from '../mail/mailer.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
  constructor(private readonly mailerService: MailerService) {
    const connection = amqp.connect([process.env.RABBITMQ_URL]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', {
          durable: true,
        });
        await channel.assertQueue('emailQueue', { durable: true });

        await channel.bindQueue(
          'emailQueue',
          process.env.EXCHANGE_NAME,
          EmailTemplates.WELCOME,
        );

        await channel.bindQueue(
          'emailQueue',
          process.env.EXCHANGE_NAME,
          EmailTemplates.RESET_PASSWORD,
        );

        await channel.bindQueue(
          'emailQueue',
          process.env.EXCHANGE_NAME,
          EmailTemplates.TEMP_PASSWORD,
        );

        await channel.consume('emailQueue', async (message) => {
          if (message) {
            try {
              const content = JSON.parse(message.content.toString());
              this.logger.log('Received message:', content);

              switch (message.fields.routingKey) {
                case EmailTemplates.WELCOME:
                  await this.mailerService.execute({
                    to: content.email,
                    template: EmailTemplates.WELCOME,
                    subject: 'Bem vindo a Yonto',
                    context: {
                      name: content.name,
                      email: content.email,
                    },
                  });
                  break;

                case EmailTemplates.TEMP_PASSWORD:
                  await this.mailerService.execute({
                    to: content.email,
                    template: EmailTemplates.TEMP_PASSWORD,
                    subject: 'Bem vindo a Yonto',
                    context: {
                      name: content.name,
                      email: content.email,
                      password: content.password,
                    },
                  });
                  break;

                case EmailTemplates.RESET_PASSWORD:
                  await this.mailerService.execute({
                    to: content.email,
                    template: EmailTemplates.RESET_PASSWORD,
                    subject: 'Redefinição de senha Yonto',
                    context: {
                      name: content.name,
                      email: content.email,
                      resetToken: content.resetToken,
                    },
                  });
                  break;

                default:
                  this.logger.error('Error processing content');
              }

              channel.ack(message);
            } catch (err) {
              this.logger.error('Error processing message:', err);
              channel.nack(message, false, true);
            }
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
