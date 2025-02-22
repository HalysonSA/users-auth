import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';

@Injectable()
export class ProfileUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(userId: string) {
    const { name, email, phone } = await this.userRepo.findById(userId);

    return {
      name,
      email,
      phone,
    };
  }
}
