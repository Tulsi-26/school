import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().min(2).max(60),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user: any = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            code: true,
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[PROFILE DEBUG] User: ${user.email}, Role: ${user.role}, Org ID: ${user.organizationId}, Org Found: ${!!user.organization}`);

    // Fallback & Lazy Fix: If user has no organization linked, but is an owner, find or CREATE the org they own
    if (!user.organization && user.role === "OWNER") {
      console.log(`[PROFILE DEBUG] User is OWNER but has no organization linked. Searching by ownerId...`);
      let ownedOrg = await prisma.organization.findFirst({
        where: { ownerId: user.id },
      });
      
      if (!ownedOrg) {
        console.log(`[PROFILE DEBUG] No organization found. Creating DEFAULT organization for owner...`);
        const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const defaultName = "Divine School";
        const slug = defaultName.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substr(2, 5);
        
        ownedOrg = await prisma.organization.create({
          data: {
            name: defaultName,
            slug: slug,
            code: generatedCode,
            ownerId: user.id
          } as any
        });
      }

      if (ownedOrg) {
        console.log(`[PROFILE DEBUG] Linking organization: ${ownedOrg.name} (${ownedOrg.id}) to user...`);
        // Link it in the database for next time
        await prisma.user.update({
          where: { id: user.id },
          data: { organizationId: ownedOrg.id }
        });
        user.organization = ownedOrg;
      }
    }

    // Lazy Fix: If organization exists but has no code, generate one
    if (user.organization && !user.organization.code) {
      console.log(`[PROFILE DEBUG] Organization found but missing code. Generating...`);
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await prisma.organization.update({
        where: { id: user.organization.id },
        data: { code: generatedCode }
      });
      user.organization.code = generatedCode;
    }

    console.log(`[PROFILE DEBUG] Final School Code: ${user.organization?.code || user.organization?.slug || "NONE"}`);

    // Lazy Fix: If user's position is null, set a default based on their role
    if (!(user as any).position) {
      const roleMap: Record<string, string> = {
        OWNER: "School Owner",
        TEACHER: "Teacher",
        STUDENT: "Student",
        ADMIN: "Admin",
      };
      const defaultPosition = roleMap[user.role];
      if (defaultPosition) {
        await prisma.user.update({
          where: { id: user.id },
          data: { position: defaultPosition }
        });
        (user as any).position = defaultPosition;
      }
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: (user as any).phone,
      position: (user as any).position,
      address: (user as any).address,
      bio: (user as any).bio,
      role: user.role,
      schoolCode: (user as any).organization?.code || (user as any).organization?.slug || null,
      schoolName: (user as any).organization?.name || null,
    });
  } catch (error) {
    console.error("[api/user/profile GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        position: updatedUser.position,
        address: updatedUser.address,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error("[api/user/profile PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
