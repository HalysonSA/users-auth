import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';
import { CreateUserRequestDTO } from '../../dtos/create-user.dto';
import { PERMISSIONS_REPOSITORY } from 'src/modules/permissions/permissions.token';
import { PermissionsRepositoryPort } from 'src/modules/permissions/repository/permissions.repository.port';
import { decode, verify } from 'jsonwebtoken';
import { TokenData } from 'src/modules/auth/auth.service';
import { ProducerService } from 'src/shared/queue/producer.service';
import { EmailTemplates } from 'src/shared/mail/mailer.service';
import { generateHashedPassword } from 'src/utils/generateHashedPassword';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepo: PermissionsRepositoryPort,
    private readonly queueService: ProducerService,
  ) {}

  async execute(user: CreateUserRequestDTO, token?: string) {
    const decoded = decode(token) as TokenData;

    if (!token && !user.password) {
      throw new BadRequestException('A senha deve ser informada');
    }

    const { hashedPassword, tempPassword } = await generateHashedPassword(
      user.password,
    );

    if (token) {
      verify(token, process.env.SECRET);
    }

    const createdUser = await this.userRepo.create({
      data: {
        ...user,
        password: hashedPassword,
        owner_id: token
          ? decoded.ownerId
            ? decoded.ownerId
            : decoded.id
          : undefined,
      },
    });

    if (!token) {
      await this.queueService.publishToQueue(
        {
          name: user.name,
          email: user.email,
        },
        EmailTemplates.WELCOME,
      );
      await this.assignDefaultAdminPermissions(createdUser.id);

      return { id: createdUser.id };
    }

    await this.queueService.publishToQueue(
      {
        name: user.name,
        email: user.email,
        password: tempPassword,
      },
      EmailTemplates.TEMP_PASSWORD,
    );

    return { id: createdUser.id };
  }

  private async assignDefaultAdminPermissions(userId: string): Promise<void> {
    const permission = await this.permissionsRepo.findByRoleAndAction(
      'ADMIN',
      'ALL',
    );

    if (!permission) {
      throw new Error('Admin permission not found');
    }

    await this.permissionsRepo.createUserPermissionRelationships(userId, [
      permission.id,
    ]);
  }
}
