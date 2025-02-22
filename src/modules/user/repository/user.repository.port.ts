import { Prisma, UserPasswordReset, Users } from '@prisma/client';

export interface UserRepositoryPort {
  create(user: Prisma.UsersCreateArgs): Promise<Users>;
  update(id: string, user: Prisma.UsersUpdateInput): Promise<Users>;
  findByOwnerId(id: string): Promise<Users[]>;
  findById(id: string): Promise<Users>;
  findByEmail(email: string): Promise<Users>;
  createResetPassword(email: string, token: string): Promise<UserPasswordReset>;
  removeResetPassword(id: string): Promise<void>;
  findResetPasswordByToken(token: string): Promise<UserPasswordReset>;
}
