import { RefreshToken } from '@prisma/client';

export interface RefreshTokenRepositoryPort {
  create(token: string, userId: string): Promise<void>;
  findToken(token: string, userId: string): Promise<RefreshToken>;
  delete(token: string): Promise<void>;
  deleteManyByUser(userId: string): Promise<void>;
}
