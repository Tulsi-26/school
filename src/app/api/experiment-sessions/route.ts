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
  instruments: z.array(z.any()),
  connections: z.array(z.any()),
  observations: z.array(z.any()),
  checklist: z.array(z.string()),
  simulationResults: z.record(z.string(), z.any()),
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

    type JsonValue = Parameters<typeof prisma.experimentSession.create>[0]["data"]["instruments"];

    if (existing) {
      const updated = await prisma.experimentSession.update({
        where: { id: existing.id },
        data: {
          instruments: parsed.data.instruments as unknown as JsonValue,
          connections: parsed.data.connections as unknown as JsonValue,
          observations: parsed.data.observations as unknown as JsonValue,
          checklist: parsed.data.checklist as unknown as JsonValue,
          simulationResults: parsed.data.simulationResults as unknown as JsonValue,
          experimentTitle,
        },
      });
      return NextResponse.json({ session: updated });
    }

    const created = await prisma.experimentSession.create({
      data: {
        experimentId: parsed.data.experimentId,
        experimentTitle,
        instruments: parsed.data.instruments as unknown as JsonValue,
        connections: parsed.data.connections as unknown as JsonValue,
        observations: parsed.data.observations as unknown as JsonValue,
        checklist: parsed.data.checklist as unknown as JsonValue,
        simulationResults: parsed.data.simulationResults as unknown as JsonValue,
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
