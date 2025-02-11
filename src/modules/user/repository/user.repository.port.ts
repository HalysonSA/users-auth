import { Prisma, Users } from '@prisma/client';

export interface UserRepositoryPort {
  create(user: Prisma.UsersCreateArgs): Promise<Users>;
  findByEmail(email: string): Promise<Users>;
}
