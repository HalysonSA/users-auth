import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from './user.repository.port';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from 'src/libs/database/prisma.service';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: Prisma.UsersCreateArgs): Promise<Users> {
    return await this.prisma.users.create(user);
  }
}
