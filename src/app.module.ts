import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './libs/database/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { QueueModule } from './shared/queue/queue.module';
import { EmailModule } from './shared/mail/mailer.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, EmailModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
