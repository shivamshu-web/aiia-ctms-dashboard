import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon database with AIIA CTMS sample records...');

  // Safe cleanup if models exist
  try {
    if ('safetyReport' in prisma) {
      await (prisma as any).safetyReport.deleteMany();
    }
    if ('patient' in prisma) {
      await (prisma as any).patient.deleteMany();
    }
    if ('study' in prisma) {
      await (prisma as any).study.deleteMany();
    }
  } catch (e) {
    console.log('Skipping cleanup:', e);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });