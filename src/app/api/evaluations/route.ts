import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { calculateStatus } from "@/lib/psychologicalStatus";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const evaluations = await prisma.evaluation.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(evaluations);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener evaluaciones" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { studentId, score } = await req.json();
    
    const status = calculateStatus(score);

    const evaluation = await prisma.evaluation.create({
      data: { 
        studentId, 
        score, 
        status
      },
      include: { student: true }
    });

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear evaluación" }, { status: 500 });
  }
}