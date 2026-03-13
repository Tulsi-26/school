import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing organization ID", { status: 400 });
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!org) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    return NextResponse.json(org);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
