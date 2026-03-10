import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/experiment-sessions/[id] — get a single saved session
export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const experimentSession = await prisma.experimentSession.findUnique({
      where: { id },
    });

    if (!experimentSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Only allow the owner to access their session
    if (experimentSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ session: experimentSession });
  } catch (error) {
    console.error("[api/experiment-sessions/[id] GET]", error);
    return NextResponse.json(
      { error: "Unable to fetch session" },
      { status: 500 }
    );
  }
}

// DELETE /api/experiment-sessions/[id] — delete a saved session
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const experimentSession = await prisma.experimentSession.findUnique({
      where: { id },
    });

    if (!experimentSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (experimentSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.experimentSession.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/experiment-sessions/[id] DELETE]", error);
    return NextResponse.json(
      { error: "Unable to delete session" },
      { status: 500 }
    );
  }
}
