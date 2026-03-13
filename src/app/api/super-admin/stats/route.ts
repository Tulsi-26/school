import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch real counts from database
    const [totalSchools, activeSchools, totalUsers, totalLabs] = await Promise.all([
      prisma.organization.count(),
      prisma.organization.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.labReport.count(),
    ]);

    // Daily Activity: For now, set to 0 as we don't have real session logs implemented yet
    const dailyActivity = 0;

    // Financial calculations (with fallback for missing model/relation)
    let totalRevenue = 0;
    let totalPending = 0;
    let recentTransactions = [];

    try {
      const revenueData = await (prisma as any).feeRecord.aggregate({
        _sum: { amountPaid: true, totalAmount: true }
      });
      totalRevenue = revenueData._sum.amountPaid || 0;
      totalPending = (revenueData._sum.totalAmount || 0) - (revenueData._sum.amountPaid || 0);

      const txs = await (prisma as any).feeRecord.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { organization: { select: { name: true } } }
      });

      recentTransactions = txs.map((tx: any) => ({
        id: tx.id,
        school: tx.organization?.name || "Unknown",
        type: "System Fee",
        amount: tx.amountPaid,
        date: tx.createdAt.toISOString().split('T')[0],
        status: tx.status
      }));
    } catch (e) {
      console.warn("FeeRecord relation might be missing or empty:", e);
    }

    // Real Trials: Count organizations created in the last 30 days
    const trialPeriod = new Date();
    trialPeriod.setDate(trialPeriod.getDate() - 30);
    const activeTrials = await prisma.organization.count({
      where: { createdAt: { gte: trialPeriod } }
    });

    const stats = {
      totalRevenue,
      totalPending,
      totalSchools,
      activeSchools,
      pausedSchools: totalSchools - activeSchools,
      totalUsers,
      totalLabs,
      collectionRate: totalRevenue + totalPending > 0 
        ? Math.round((totalRevenue / (totalRevenue + totalPending)) * 100) 
        : 100,
      recentTransactions,
      activeTrials,
      databaseStatus: "Connected",
      authStatus: "Active"
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("[STATS_GET] Critical Error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
