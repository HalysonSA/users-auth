import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';
import { CreateUserRequestDTO } from '../../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PERMISSIONS_REPOSITORY } from 'src/modules/permissions/permissions.token';
import { PermissionsRepositoryPort } from 'src/modules/permissions/repository/permissions.repository.port';
import { decode } from 'jsonwebtoken';
import { TokenData } from 'src/modules/auth/auth.service';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepo: PermissionsRepositoryPort,
  ) {}

  async execute(user: CreateUserRequestDTO, token?: string) {
    const decoded = decode(token) as TokenData;
    const hashedPassword = await this.generateHashedPassword(user.password);

    const createdUser = await this.userRepo.create({
      data: {
        ...user,
        password: hashedPassword,
        owner_id: token ? decoded.id : undefined,
      },
    });

    if (!token) {
      await this.assignDefaultAdminPermissions(createdUser.id);
    }

    return { id: createdUser.id };
  }

  private async generateHashedPassword(password?: string): Promise<string> {
    const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
    const passwordToHash = password ?? randomBytes(8).toString('hex');
    return bcrypt.hash(passwordToHash, saltRounds);
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
