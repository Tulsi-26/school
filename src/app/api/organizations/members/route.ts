import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["STUDENT", "TEACHER"]).optional().default("STUDENT"),
});

// POST /api/organizations/members — add a member to the caller's organization
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caller = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!caller || !caller.organizationId) {
      return NextResponse.json(
        { error: "You must belong to an organization" },
        { status: 403 }
      );
    }

    if (caller.role !== "ADMIN" && caller.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Only admins and teachers can add members" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = addMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found. They must sign up first." },
        { status: 404 }
      );
    }

    if (targetUser.organizationId) {
      return NextResponse.json(
        { error: "User already belongs to an organization" },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        organizationId: caller.organizationId,
        role: parsed.data.role,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ member: updated }, { status: 200 });
  } catch (error) {
    console.error("[api/organizations/members POST]", error);
    return NextResponse.json(
      { error: "Unable to add member" },
      { status: 500 }
    );
  }
}
