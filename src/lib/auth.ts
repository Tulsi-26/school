import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.warn(
    "[auth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not configured. Google sign-in will be disabled."
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please provide both email and password.");
        }

        const email = credentials.email.toLowerCase();

        // Super Admin Fixed Credentials Check
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@school.com";
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "superadmin123";

        if (email === superAdminEmail && credentials.password === superAdminPassword) {
          return {
            id: "super-admin-id",
            email: superAdminEmail,
            name: "Super Admin",
            image: null,
            role: "SUPER_ADMIN",
            organizationId: null,
          };
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash) {
          throw new Error("Incorrect email or password.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Incorrect email or password.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: (user as any).image,
          role: user.role as any,
          organizationId: user.organizationId,
        };
      },
    }),
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("[Auth] Setting JWT for user:", (user as any).email, (user as any).role);
        token.role = (user as any).role ?? "STUDENT";
        token.organizationId = (user as any).organizationId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "STUDENT";
        session.user.organizationId = token.organizationId ?? null;
        console.log("[Auth] final session on server:", session.user.email, session.user.role);
      }

      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      if (!user.emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
};

