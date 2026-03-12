import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(req: any, { params }: { params: Promise<{ nextauth: string[] }> }) {
  await params;
  return handler(req, { params: await params });
}

export async function POST(req: any, { params }: { params: Promise<{ nextauth: string[] }> }) {
  await params;
  return handler(req, { params: await params });
}

