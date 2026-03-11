const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test_db_connection@example.com',
        name: 'Test User',
      },
    });
    console.log('Successfully created user:', user);
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Successfully deleted user.');
  } catch (error) {
    console.error('Prisma Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
