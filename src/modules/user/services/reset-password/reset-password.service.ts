import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';
import { randomBytes } from 'crypto';
import { PERMISSIONS_REPOSITORY } from 'src/modules/permissions/permissions.token';
import { PermissionsRepositoryPort } from 'src/modules/permissions/repository/permissions.repository.port';
import { ProducerService } from 'src/shared/queue/producer.service';
import { EmailTemplates } from 'src/shared/mail/mailer.service';
import { generateHashedPassword } from 'src/utils/generateHashedPassword';

@Injectable()
export class ResetUserPasswordService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepo: PermissionsRepositoryPort,
    private readonly queueService: ProducerService,
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);

    const { token } = await this.userRepo.createResetPassword(
      email,
      randomBytes(12).toString('hex'),
    );

    this.queueService.publishToQueue(
      {
        name: user.name,
        email: user.email,
        resetToken: token,
      },
      EmailTemplates.RESET_PASSWORD,
    );
  }

  async newPassword(password: string, token: string) {
    const exists = await this.userRepo.findResetPasswordByToken(token);

    if (!exists || !exists.isValid) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepo.findByEmail(exists.email);

    const { hashedPassword } = await generateHashedPassword(password);

    this.userRepo.update(user.id, { password: hashedPassword });
    this.userRepo.removeResetPassword(exists.id);
  }
}
