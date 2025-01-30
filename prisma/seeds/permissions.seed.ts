import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPermissions() {
  await prisma.permissions.createMany({
    data: [
      { role: 'FINANCIAL', action: 'CREATE' },
      { role: 'FINANCIAL', action: 'LIST' },
      { role: 'FINANCIAL', action: 'UPDATE' },
      { role: 'FINANCIAL', action: 'DELETE' },
      { role: 'PEOPLE', action: 'CREATE' },
      { role: 'PEOPLE', action: 'LIST' },
      { role: 'PEOPLE', action: 'UPDATE' },
      { role: 'PEOPLE', action: 'DELETE' },
      { role: 'ADMIN', action: 'ALL' },
    ],
  });
}
