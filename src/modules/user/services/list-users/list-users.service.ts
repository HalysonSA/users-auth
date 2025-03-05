import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';
import { User } from 'src/modules/auth/guards/auth.guard';

@Injectable()
export class ListUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(user: User) {
    return await this.userRepo.findAllUsersByUser(user.id, user.ownerId);
  }
}
