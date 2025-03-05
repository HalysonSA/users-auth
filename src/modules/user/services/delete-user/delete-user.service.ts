import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';
import { User } from 'src/modules/auth/guards/auth.guard';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(id: string, user: User) {
    const userToDelete = await this.userRepo.findById(id);

    if (!userToDelete) {
      throw new NotFoundException();
    }

    if (!(userToDelete.owner_id === user.id)) {
      throw new UnauthorizedException();
    }

    return await this.userRepo.delete(userToDelete.id);
  }
}
