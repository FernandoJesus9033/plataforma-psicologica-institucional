import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

function calculateStatus(score: number): string {
  if (score >= 70) return "GREEN";
  if (score >= 40) return "YELLOW";
  return "RED";
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener evaluaciones desde PostgreSQL
    const evaluations = await prisma.evaluation.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Formatear para el frontend (mantener misma estructura)
    const formattedEvaluations = evaluations.map(e => ({
      id: e.id,
      studentId: e.studentId,
      studentName: e.student.name || "Estudiante",
      studentEmail: e.student.email,
      score: e.score,
      status: e.status,
      createdAt: e.createdAt.toISOString()
    }));

    return NextResponse.json(formattedEvaluations);
  } catch (error) {
    console.error("Error al obtener evaluaciones:", error);
    return NextResponse.json({ error: "Error al obtener evaluaciones" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar rol desde PostgreSQL
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden crear evaluaciones" }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, score } = body;

    if (!studentId || score === undefined) {
      return NextResponse.json(
        { error: "Faltan datos: studentId y score son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar al estudiante en PostgreSQL (User con rol STUDENT)
    const estudiante = await prisma.user.findFirst({
      where: {
        OR: [
          { id: studentId },
          { email: studentId }
        ],
        role: "STUDENT"
      }
    });

    if (!estudiante) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    const status = calculateStatus(score);
    console.log("✅ Creando evaluación:", { studentId: estudiante.id, studentName: estudiante.name, score, status });

    // Crear la evaluación en PostgreSQL
    const evaluation = await prisma.evaluation.create({
      data: {
        studentId: estudiante.id,
        score: score,
        status: status
      },
      include: {
        student: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Formatear respuesta
    const response = {
      id: evaluation.id,
      studentId: evaluation.studentId,
      studentName: evaluation.student.name || "Estudiante",
      studentEmail: evaluation.student.email,
      score: evaluation.score,
      status: evaluation.status,
      createdAt: evaluation.createdAt.toISOString()
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear evaluación:", error);
    return NextResponse.json({ error: "Error al crear evaluación: " + (error as Error).message }, { status: 500 });
  }
}