import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from './user.repository.port';
import { Prisma, UserPasswordReset, Users } from '@prisma/client';
import { PrismaService } from 'src/libs/database/prisma.service';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: Prisma.UsersCreateArgs): Promise<Users> {
    return await this.prisma.users.create(user);
  }

  async update(id: string, user: Prisma.UsersUpdateInput): Promise<Users> {
    return await this.prisma.users.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.prisma.users.findFirstOrThrow({
      where: {
        email,
      },
    });
  }

  async findByOwnerId(id: string): Promise<Users[]> {
    return await this.prisma.users.findMany({
      where: {
        owner_id: id,
      },
    });
  }

  async createResetPassword(
    email: string,
    token: string,
  ): Promise<UserPasswordReset> {
    return await this.prisma.userPasswordReset.create({
      data: {
        email,
        token,
      },
    });
  }

  async removeResetPassword(id: string): Promise<void> {
    await this.prisma.userPasswordReset.update({
      where: {
        id,
      },
      data: {
        isValid: false,
      },
    });
  }

  async findResetPasswordByToken(token: string): Promise<UserPasswordReset> {
    return await this.prisma.userPasswordReset.findFirstOrThrow({
      where: {
        token,
      },
    });
  }
}
