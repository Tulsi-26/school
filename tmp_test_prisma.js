const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Attempting to fetch organizations with counts...");
    const schools = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            members: true,
            projects: true,
            labReports: true,
          }
        }
      }
    });
    console.log("Success! Found", schools.length, "schools.");
    console.log("Sample:", JSON.stringify(schools[0], null, 2));
  } catch (error) {
    console.error("ERROR during prisma query:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
