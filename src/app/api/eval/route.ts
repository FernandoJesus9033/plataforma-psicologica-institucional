import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

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

    // Verificar que sea psicólogo
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden crear evaluaciones" }, { status: 403 });
    }

    const body = await req.json();
    console.log("📝 Datos recibidos para evaluación:", body);

    const { studentId, score, status } = body;

    if (!studentId || score === undefined || score === null) {
      return NextResponse.json(
        { error: "Faltan datos: studentId y score son obligatorios" },
        { status: 400 }
      );
    }

    // ✅ Verificar que el estudiante existe (por ID o email)
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
      console.log("❌ Estudiante no encontrado:", studentId);
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    console.log("✅ Estudiante encontrado:", estudiante.id, estudiante.email);

    // ✅ Validar que el score sea un número válido
    const scoreNumber = parseInt(score);
    if (isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > 100) {
      return NextResponse.json(
        { error: "El puntaje debe ser un número entre 0 y 100" },
        { status: 400 }
      );
    }

    // ✅ Crear la evaluación
    const evaluation = await prisma.evaluation.create({
      data: {
        studentId: estudiante.id,
        score: scoreNumber,
        status: status || "GREEN"
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log("✅ Evaluación creada:", evaluation.id);
    return NextResponse.json(evaluation, { status: 201 });

  } catch (error) {
    console.error("Error en POST /api/eval:", error);
    return NextResponse.json({ error: "Error al crear evaluación: " + (error as Error).message }, { status: 500 });
  }
}