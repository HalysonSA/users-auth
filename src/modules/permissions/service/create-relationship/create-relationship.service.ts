import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PermissionsRepositoryPort } from '../../repository/permissions.repository.port';
import { PERMISSIONS_REPOSITORY } from '../../permissions.token';
import { CreateRelationshipUserPermissionRequestDTO } from '../../dtos/user-permission-relationship.dto';
import { User } from 'src/modules/auth/guards/auth.guard';
import { USER_REPOSITORY } from 'src/modules/user/user.token';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';

@Injectable()
export class CreateRelationshipUserPermissionService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepo: PermissionsRepositoryPort,
  ) {}

  async execute(props: CreateRelationshipUserPermissionRequestDTO, user: User) {
    const { userId, permissions } = props;

    if (!user.permissions.includes('ADMIN:ALL')) {
      throw new UnauthorizedException();
    }

    const myUsers = await this.userRepo.findByOwnerId(user.id);

    const isUserUnderManagement = myUsers.some((u) => u.id === userId);

    if (!isUserUnderManagement) {
      throw new UnauthorizedException(
        'Você não tem permissão para modificar este usuário.',
      );
    }

    await this.permissionsRepo.createUserPermissionRelationships(
      userId,
      permissions,
    );
  }
}
