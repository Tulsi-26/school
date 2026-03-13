import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

const acceptSchema = z.object({
  token: z.string().min(1, "Token is required"),
  name: z.string().min(1, "Name is required").max(100),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = acceptSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const { token, name, password } = validation.data;

    // Hash the token and find invitation
    const tokenHash = hashToken(token);
    const invitation = await prisma.invitation.findUnique({
      where: { tokenHash },
      include: { organization: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 400 });
    }

    if (invitation.isUsed) {
      return NextResponse.json({ error: "This invitation has already been used" }, { status: 400 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "This invitation has expired" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    const result = await prisma.$transaction(async (tx) => {
      // Mark invitation as used
      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          isUsed: true,
          acceptedAt: new Date(),
        },
      });

      if (existingUser) {
        // Update existing user with new org and role
        return await tx.user.update({
          where: { id: existingUser.id },
          data: {
            organizationId: invitation.organizationId,
            role: invitation.role,
            name: name, // Optionally update name
          },
        });
      } else {
        // Create new user
        return await tx.user.create({
          data: {
            email: invitation.email,
            name,
            passwordHash,
            role: invitation.role,
            organizationId: invitation.organizationId,
            emailVerified: new Date(), // Mark as verified since they used an invite link
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Invitation accepted successfully",
      user: {
        email: result.email,
        name: result.name,
        role: result.role,
        organizationName: invitation.organization.name,
      },
    });
  } catch (error) {
    console.error("[POST /api/invitations/accept]", error);
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 });
  }
}
