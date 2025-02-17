import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { EmailProps, EmailTemplates } from '../mail/mailer.service';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;

  constructor() {
    const connection = amqp.connect([process.env.RABBITMQ_URL]);
    this.channelWrapper = connection.createChannel({
      setup: async (channel: Channel) => {
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
      },
    });
  }

  async publishToQueue(mail: EmailProps, routingKey: EmailTemplates) {
    try {
      const success = await this.channelWrapper.publish(
        process.env.EXCHANGE_NAME,
        routingKey,
        Buffer.from(JSON.stringify(mail)),
        { persistent: true },
      );

      if (success) {
        Logger.log(`Message sent to ${routingKey}`);
      } else {
        Logger.warn(`Failed to send message to ${routingKey}`);
      }
    } catch (error) {
      Logger.error('Error publishing message', error);
      throw new HttpException(
        'Error publishing message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
