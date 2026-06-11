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
    console.error("Error al obtener evaluaciones:", error);
    return NextResponse.json({ error: "Error al obtener evaluaciones" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, score } = body;

    if (!studentId || score === undefined) {
      return NextResponse.json(
        { error: "Faltan datos: studentId y score son obligatorios" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

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
    console.error("Error al crear evaluación:", error);
    return NextResponse.json({ error: "Error al crear evaluación: " + (error as Error).message }, { status: 500 });
  }
}