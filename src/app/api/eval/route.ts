import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // ✅ Eliminado include: { student: true }
    const evaluations = await prisma.evaluation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("Error en GET /api/eval:", error);
    return NextResponse.json({ error: "Error al obtener evaluaciones" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, score, status } = body;

    // ✅ Eliminado include: { student: true }
    const evaluation = await prisma.evaluation.create({
      data: {
        studentId,
        score,
        status: status || "PENDING"
      }
    });

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/eval:", error);
    return NextResponse.json({ error: "Error al crear evaluación" }, { status: 500 });
  }
}