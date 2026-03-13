import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/organizations — list organizations the user belongs to
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: {
          include: {
            members: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
      },
    });

    if (!user?.organization) {
      return NextResponse.json({ organizations: [] });
    }

    return NextResponse.json({ organizations: [user.organization] });
  } catch (error) {
    console.error("[api/organizations GET]", error);
    return NextResponse.json(
      { error: "Unable to fetch organizations" },
      { status: 500 }
    );
  }
}

// POST /api/organizations — create a new organization (school)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Only teachers and admins can create organizations" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createOrgSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const baseSlug = slugify(parsed.data.name);
    let slug = baseSlug;
    let counter = 0;
    while (await prisma.organization.findUnique({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const org = await prisma.$transaction(async (tx) => {
      // Generate a 6-character school code (e.g. ABC123)
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const newOrg = await tx.organization.create({
        data: {
          name: parsed.data.name,
          slug,
          code,
          description: parsed.data.description ?? null,
          ownerId: user.id,
        },
      });

      // Make the creator the owner and attach them to the org
      await tx.user.update({
        where: { id: user.id },
        data: { organizationId: newOrg.id, role: "OWNER" },
      });

      return newOrg;
    });

    return NextResponse.json({ organization: org }, { status: 201 });
  } catch (error) {
    console.error("[api/organizations POST]", error);
    return NextResponse.json(
      { error: "Unable to create organization" },
      { status: 500 }
    );
  }
}
