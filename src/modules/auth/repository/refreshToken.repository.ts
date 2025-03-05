import { Injectable } from '@nestjs/common';
import { RefreshTokenRepositoryPort } from './refreshToken.repository.port';
import { RefreshToken } from '@prisma/client';
import { PrismaService } from 'src/libs/database/prisma.service';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, userId: string): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token,
        user_id: userId,
      },
    });
  }

  async findToken(token: string, userId: string): Promise<RefreshToken> {
    return await this.prisma.refreshToken.findFirst({
      where: {
        token: token,
        user_id: userId,
      },
    });
  }

  async delete(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  async deleteManyByUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        user_id: userId,
      },
    });
  }
}
