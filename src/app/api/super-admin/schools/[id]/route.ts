import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const school = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
            projects: true,
            labReports: true,
          }
        },
        members: {
          select: {
            role: true,
          }
        },
        feeRecords: true,
      }
    });

    if (!school) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    // Calculate role breakdown
    const roleStats = {
      ADMIN: school.members.filter(m => m.role === "ADMIN").length,
      TEACHER: school.members.filter(m => m.role === "TEACHER").length,
      STUDENT: school.members.filter(m => m.role === "STUDENT").length,
      OWNER: school.members.filter(m => m.role === "OWNER").length,
    };

    // Calculate financial breakdown
    const financials = {
      totalDue: school.feeRecords.reduce((acc, curr) => acc + curr.totalAmount, 0),
      totalPaid: school.feeRecords.reduce((acc, curr) => acc + curr.amountPaid, 0),
    };
    financials["totalPending"] = financials.totalDue - financials.totalPaid;

    return NextResponse.json({
      ...school,
      roleStats,
      financials,
    });
  } catch (error: any) {
    console.error("[SCHOOL_DETAILS_GET]", error);
    return new NextResponse(error?.message || "Internal Error", { status: 500 });
  }
}
