import { PrismaClient } from '@prisma/client';
import { seedPermissions } from './permissions.seed';

const prisma = new PrismaClient();

async function main() {
  seedPermissions();
  console.log('Seed executado com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
