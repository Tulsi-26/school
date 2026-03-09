import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard — teacher/admin dashboard data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only teachers and admins can access the dashboard" },
        { status: 403 }
      );
    }

    if (!user.organizationId) {
      return NextResponse.json({
        organization: null,
        students: [],
        recentReports: [],
        stats: { totalStudents: 0, totalReports: 0, activeExperiments: 0 },
      });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: user.organizationId },
    });

    const students = await prisma.user.findMany({
      where: {
        organizationId: user.organizationId,
        role: "STUDENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { labReports: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const recentReports = await prisma.labReport.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const totalReports = await prisma.labReport.count({
      where: { organizationId: user.organizationId },
    });

    const uniqueExperiments = await prisma.labReport.findMany({
      where: { organizationId: user.organizationId },
      distinct: ["experimentId"],
      select: { experimentId: true },
    });

    return NextResponse.json({
      organization,
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        createdAt: s.createdAt,
        reportCount: s._count.labReports,
      })),
      recentReports,
      stats: {
        totalStudents: students.length,
        totalReports,
        activeExperiments: uniqueExperiments.length,
      },
    });
  } catch (error) {
    console.error("[api/dashboard GET]", error);
    return NextResponse.json(
      { error: "Unable to fetch dashboard data" },
      { status: 500 }
    );
  }
}
