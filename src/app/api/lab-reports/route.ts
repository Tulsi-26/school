import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const experimentCatalog: Record<
  string,
  { title: string; aim: string; apparatus: string[]; theory: string }
> = {
  "ohm-law": {
    title: "Ohm's Law Verification",
    aim: "To verify Ohm's law by studying the relationship between voltage and current for a given resistor.",
    apparatus: [
      "Battery / DC power supply",
      "Resistor (known value)",
      "Ammeter",
      "Voltmeter",
      "Connecting wires",
      "Rheostat",
    ],
    theory:
      "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across those points, provided the temperature remains constant. Mathematically, V = IR, where V is the voltage, I is the current, and R is the resistance.",
  },
  "wheatstone-bridge": {
    title: "Wheatstone Bridge",
    aim: "To determine an unknown resistance using the Wheatstone Bridge balance principle.",
    apparatus: [
      "Wheatstone Bridge kit",
      "Galvanometer",
      "Known resistors",
      "Unknown resistor",
      "Battery",
      "Connecting wires",
    ],
    theory:
      "A Wheatstone Bridge consists of four resistors arranged in a diamond configuration. When the bridge is balanced, the ratio of resistors in one branch equals the ratio in the other: R1/R2 = R3/R4. This allows calculation of an unknown resistance when the other three are known.",
  },
  "reflection-refraction": {
    title: "Reflection & Refraction",
    aim: "To study the laws of reflection and Snell's law of refraction using light rays.",
    apparatus: [
      "Light source / Ray box",
      "Plane mirror",
      "Glass slab / Prism",
      "Protractor",
      "White paper",
      "Pins",
    ],
    theory:
      "The law of reflection states that the angle of incidence equals the angle of reflection. Snell's law of refraction states that n1 sin(θ1) = n2 sin(θ2), where n1 and n2 are the refractive indices of the two media.",
  },
  "newton-second-law": {
    title: "Newton's Second Law",
    aim: "To verify Newton's second law of motion (F = ma) using blocks and pulleys.",
    apparatus: [
      "Dynamics cart / Block",
      "Pulley",
      "Hanging masses",
      "String",
      "Stopwatch",
      "Ruler / Measuring tape",
    ],
    theory:
      "Newton's second law states that the net force acting on an object is equal to the product of its mass and acceleration: F = ma. By varying the applied force or mass and measuring the resulting acceleration, the law can be verified.",
  },
};

const createReportSchema = z.object({
  experimentId: z.string(),
  observations: z.array(z.record(z.any())),
  calculations: z.string().optional(),
  result: z.string().optional(),
  conclusion: z.string().optional(),
});

// GET /api/lab-reports — list reports for the current user (or org students for teachers)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    // Teachers/admins can view reports for any student in their org
    if (
      studentId &&
      (user.role === "TEACHER" || user.role === "ADMIN") &&
      user.organizationId
    ) {
      const reports = await prisma.labReport.findMany({
        where: {
          userId: studentId,
          organizationId: user.organizationId,
        },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
      return NextResponse.json({ reports });
    }

    // Default: user's own reports
    const reports = await prisma.labReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("[api/lab-reports GET]", error);
    return NextResponse.json(
      { error: "Unable to fetch reports" },
      { status: 500 }
    );
  }
}

// POST /api/lab-reports — auto-generate a lab report from experiment data
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const catalog = experimentCatalog[parsed.data.experimentId];
    if (!catalog) {
      return NextResponse.json(
        { error: "Unknown experiment ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // Auto-generate result summary from observations
    const obsCount = parsed.data.observations.length;
    const autoResult =
      parsed.data.result ??
      `The experiment was conducted with ${obsCount} observation(s). The data collected supports the theoretical predictions for ${catalog.title}.`;

    const autoConclusion =
      parsed.data.conclusion ??
      `The experiment "${catalog.title}" was successfully completed. The observations are consistent with the underlying theory, confirming the expected relationships between the measured quantities.`;

    const report = await prisma.labReport.create({
      data: {
        title: `Lab Report: ${catalog.title}`,
        experimentId: parsed.data.experimentId,
        experimentTitle: catalog.title,
        aim: catalog.aim,
        apparatus: catalog.apparatus,
        theory: catalog.theory,
        observations: parsed.data.observations,
        calculations: parsed.data.calculations ?? null,
        result: autoResult,
        conclusion: autoConclusion,
        userId: session.user.id,
        organizationId: user?.organizationId ?? null,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("[api/lab-reports POST]", error);
    return NextResponse.json(
      { error: "Unable to generate report" },
      { status: 500 }
    );
  }
}
