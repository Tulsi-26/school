import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const experimentNames: Record<string, string> = {
  "ohm-law": "Ohm's Law Verification",
  "wheatstone-bridge": "Wheatstone Bridge",
  "reflection-refraction": "Reflection & Refraction",
  "newton-second-law": "Newton's Second Law",
};

const saveSessionSchema = z.object({
  experimentId: z.string(),
  instruments: z.array(z.object({
    id: z.string(),
    type: z.string(),
    name: z.string(),
    position: z.object({ x: z.number(), y: z.number() }),
    properties: z.record(z.string(), z.unknown()),
    terminals: z.array(z.object({
      id: z.string(),
      parentId: z.string(),
      type: z.string(),
      position: z.object({ x: z.number(), y: z.number() }),
    })),
  })),
  connections: z.array(z.object({
    id: z.string(),
    from: z.string(),
    to: z.string(),
    color: z.string(),
  })),
  observations: z.array(z.record(z.string(), z.unknown())),
  checklist: z.array(z.string()),
  simulationResults: z.record(z.string(), z.unknown()),
});

// GET /api/experiment-sessions — list saved sessions for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const experimentId = searchParams.get("experimentId");

    const where: Record<string, string> = { userId: session.user.id };
    if (experimentId) {
      where.experimentId = experimentId;
    }

    const sessions = await prisma.experimentSession.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("[api/experiment-sessions GET]", error);
    return NextResponse.json(
      { error: "Unable to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST /api/experiment-sessions — save or update an experiment session
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = saveSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const experimentTitle =
      experimentNames[parsed.data.experimentId] || parsed.data.experimentId;

    // Upsert: find existing session for same user+experiment and update, or create new
    const existing = await prisma.experimentSession.findFirst({
      where: {
        userId: session.user.id,
        experimentId: parsed.data.experimentId,
      },
      orderBy: { updatedAt: "desc" },
    });

    const jsonData = {
      instruments: parsed.data.instruments as unknown as Prisma.InputJsonValue,
      connections: parsed.data.connections as unknown as Prisma.InputJsonValue,
      observations: parsed.data.observations as unknown as Prisma.InputJsonValue,
      checklist: parsed.data.checklist as unknown as Prisma.InputJsonValue,
      simulationResults: parsed.data.simulationResults as unknown as Prisma.InputJsonValue,
    };

    if (existing) {
      const updated = await prisma.experimentSession.update({
        where: { id: existing.id },
        data: {
          ...jsonData,
          experimentTitle,
        },
      });
      return NextResponse.json({ session: updated });
    }

    const created = await prisma.experimentSession.create({
      data: {
        experimentId: parsed.data.experimentId,
        experimentTitle,
        ...jsonData,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ session: created }, { status: 201 });
  } catch (error) {
    console.error("[api/experiment-sessions POST]", error);
    return NextResponse.json(
      { error: "Unable to save session" },
      { status: 500 }
    );
  }
}
