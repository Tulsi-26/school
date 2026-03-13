const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Adding even more real transaction data...");

    const orgs = await prisma.organization.findMany();
    
    if (orgs.length === 0) {
      console.log("No organizations found.");
      return;
    }

    const txs = [
      { name: "Monthly Subscription", amount: 1200 },
      { name: "Lab Expansion Pack", amount: 450 },
      { name: "Premium Support", amount: 200 },
      { name: "Annual License", amount: 12000 },
    ];

    for (const org of orgs) {
      for (const tx of txs) {
        await prisma.feeRecord.create({
          data: {
            studentId: "system",
            studentName: tx.name,
            amountPaid: Math.random() > 0.3 ? tx.amount : 0,
            totalAmount: tx.amount,
            status: Math.random() > 0.3 ? "PAID" : "PENDING",
            organizationId: org.id
          }
        });
      }
    }

    console.log("Additional transactions seeded successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
