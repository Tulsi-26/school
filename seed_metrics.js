const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Seeding real-looking data...");

    // Get all organizations
    const orgs = await prisma.organization.findMany();
    
    if (orgs.length === 0) {
      console.log("No organizations found to seed data for.");
      return;
    }

    for (const org of orgs) {
      console.log(`Seeding data for ${org.name}...`);
      
      // Create some projects
      await prisma.project.createMany({
        data: [
          { title: "Science Fair 2024", description: "Annual science exhibition", status: "ACTIVE", organizationId: org.id },
          { title: "Code for Good", description: "Hackathon event", status: "ACTIVE", organizationId: org.id },
          { title: "E-Learning Platform", description: "Internal LMS", status: "COMPLETED", organizationId: org.id },
        ]
      });

      // Create some fee records
      await prisma.feeRecord.createMany({
        data: [
          { studentId: "s1", studentName: "John Doe", amountPaid: 5000, totalAmount: 5000, status: "PAID", organizationId: org.id },
          { studentId: "s2", studentName: "Jane Smith", amountPaid: 3000, totalAmount: 5000, status: "PARTIAL", organizationId: org.id },
          { studentId: "s3", studentName: "Bob Wilson", amountPaid: 0, totalAmount: 5000, status: "PENDING", organizationId: org.id },
        ]
      });
    }

    console.log("Seeding complete! Dashboard should now show real data.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
