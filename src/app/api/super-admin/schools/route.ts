import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("[SCHOOLS_GET] Full session:", JSON.stringify(session, null, 2));

  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    console.error("[SCHOOLS_GET] Unauthorized", session?.user);
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const schools = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json(schools);
  } catch (error: any) {
    console.error("[SCHOOLS_GET] Critical Error:", error);
    return new NextResponse(JSON.stringify({ 
      error: error?.message || "Internal Error",
      stack: error?.stack,
      code: error?.code
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    console.error("[SCHOOL_PATCH] Unauthorized access attempt", session?.user);
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("[SCHOOL_PATCH] Request body:", body);
    
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      console.error("[SCHOOL_PATCH] Missing fields", { id, isActive });
      return new NextResponse("Missing fields (id, isActive)", { status: 400 });
    }

    const school = await prisma.organization.update({
      where: { id },
      data: { isActive },
    });

    console.log("[SCHOOL_PATCH] Success:", school.id, "isActive:", school.isActive);
    return NextResponse.json(school);
  } catch (error: any) {
    console.error("[SCHOOL_PATCH] Critical Database error:", error);
    if (error.code) console.error("[SCHOOL_PATCH] Error Code:", error.code);
    return new NextResponse(error?.message || "Internal Error", { status: 500 });
  }
}
