import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';
import { User } from 'src/modules/auth/guards/auth.guard';
import { REFRESH_TOKEN_REPOSITORY } from 'src/modules/auth/auth.token';
import { RefreshTokenRepositoryPort } from 'src/modules/auth/repository/refreshToken.repository.port';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
  ) {}

  async execute(id: string, user: User) {
    const userToDelete = await this.userRepo.findById(id);

    if (!userToDelete) {
      throw new NotFoundException();
    }

    if (!(userToDelete.owner_id === user.id)) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenRepo.deleteManyByUser(userToDelete.id);

    return await this.userRepo.delete(userToDelete.id);
  }
}
