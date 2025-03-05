import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PermissionsRepositoryPort } from '../../repository/permissions.repository.port';
import { PERMISSIONS_REPOSITORY } from '../../permissions.token';
import { RelationshipUserPermissionRequestDTO } from '../../dtos/user-permission-relationship.dto';
import { User } from 'src/modules/auth/guards/auth.guard';
import { USER_REPOSITORY } from 'src/modules/user/user.token';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';

@Injectable()
export class DeleteRelationshipUserPermissionService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepo: PermissionsRepositoryPort,
  ) {}

  async execute(props: RelationshipUserPermissionRequestDTO, user: User) {
    const { userId, permissions } = props;

    if (!user.permissions.includes('ADMIN:ALL')) {
      throw new UnauthorizedException();
    }

    const myUser = await this.userRepo.findById(userId);

    if (!myUser) {
      throw new NotFoundException();
    }

    if (!(myUser.owner_id === user.id)) {
      throw new UnauthorizedException();
    }

    await this.permissionsRepo.deleteUserPermissionRelationship(
      userId,
      permissions,
    );
  }
}
