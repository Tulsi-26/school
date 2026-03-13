import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  addMinutesToNow,
  defaultExpiryMinutes,
  generateToken,
  hashToken,
} from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

const signupSchema = z.object({
  fullName: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
  role: z.enum(["STUDENT", "TEACHER", "OWNER"]).default("STUDENT"),
  intent: z.enum(["create", "join"]),
  organizationName: z.string().optional().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.intent === "create" && !data.organizationName) return false;
  return true;
}, {
  message: "Organization name is required to create a new organization",
  path: ["organizationName"],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid signup data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const name = parsed.data.fullName;
    const { password, role, intent, organizationName, phone } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Use a transaction if we need to create an organization
    const newUser = await prisma.$transaction(async (tx) => {
      let orgId = null;

      if (intent === "create" && organizationName) {
        // Simple slug generation
        const slug = organizationName.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substr(2, 5);
        // Generate a 6-character school code (e.g. ABC123)
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const org = await tx.organization.create({
          data: {
            name: organizationName,
            slug,
            code,
          },
        });
        orgId = org.id;
      }

      const roleMap: Record<string, string> = {
        OWNER: "School Owner",
        TEACHER: "Teacher",
        STUDENT: "Student",
      };

      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          phone,
          role: intent === "create" ? "OWNER" : role, // If creating org, force OWNER role
          position: intent === "create" ? "School Owner" : (roleMap[role] || null),
          organizationId: orgId,
        },
      });

      // Update organization ownerId if created
      if (orgId) {
        await tx.organization.update({
          where: { id: orgId },
          data: { ownerId: user.id },
        });
      }

      return user;
    });

    await prisma.emailVerificationToken.deleteMany({ where: { userId: newUser.id } });

    const token = generateToken();
    const tokenHash = hashToken(token);

    await prisma.emailVerificationToken.create({
      data: {
        tokenHash,
        userId: newUser.id,
        expiresAt: addMinutesToNow(defaultExpiryMinutes.verification),
      },
    });

    await sendVerificationEmail(newUser.email, token);

    return NextResponse.json(
      {
        message:
          "Account created. Please verify your email using the link we just sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[auth/signup]", error);
    return NextResponse.json(
      { error: "Unable to create account right now" },
      { status: 500 }
    );
  }
}

