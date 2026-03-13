import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken, addMinutesToNow } from "@/lib/tokens";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["TEACHER", "ADMIN"]).default("TEACHER"),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only owners and admins can invite
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser || (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Only organization owners and admins can send invitations" },
        { status: 403 }
      );
    }

    if (!currentUser.organizationId) {
      return NextResponse.json(
        { error: "You must belong to an organization to send invitations" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = inviteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const { email, role } = validation.data;

    // Check if user with this email already exists in this org
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        organizationId: currentUser.organizationId,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists in your organization" },
        { status: 400 }
      );
    }

    // Check for existing active invitation
    const existingInvite = await prisma.invitation.findFirst({
      where: {
        email: email.toLowerCase(),
        organizationId: currentUser.organizationId,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "An active invitation already exists for this email" },
        { status: 400 }
      );
    }

    // Generate secure token
    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = addMinutesToNow(60 * 24 * 7); // 7 days

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        organizationId: currentUser.organizationId,
        email: email.toLowerCase(),
        tokenHash,
        role: role as any,
        invitedBy: currentUser.id,
        expiresAt,
      },
      include: {
        organization: {
          select: {
            name: true,
          }
        }
      }
    });

    const inviteLink = `${new URL(request.url).origin}/accept-invitation?token=${rawToken}`;

    // Send the email
    try {
      const { sendInvitationEmail } = await import("@/lib/email");
      await sendInvitationEmail(
        email, 
        inviteLink, 
        invitation.organization.name, 
        role
      );
    } catch (emailError) {
      console.error("[POST /api/invitations] Failed to send email:", emailError);
      // We don't fail the whole request because the invite was created in DB
    }

    return NextResponse.json({
      success: true,
      message: `Invitation created for ${email}`,
      inviteLink,
      expiresAt,
    });
  } catch (error) {
    console.error("[POST /api/invitations]", error);
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 });
  }
}
