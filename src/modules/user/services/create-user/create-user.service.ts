import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.token';
import { UserRepositoryPort } from '../../repository/user.repository.port';
import { CreateUserRequestDTO } from '../../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(user: CreateUserRequestDTO) {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
    const hashedPassword = await bcrypt.hash(
      user.password ?? randomBytes(8).toString('hex'),
      salt,
    );

    const { id } = await this.userRepo.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    return id;
  }
}
