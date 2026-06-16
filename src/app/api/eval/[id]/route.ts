import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET - Obtener una evaluación específica
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    // ✅ Incluir datos del estudiante
    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
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

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluación no encontrada" }, { status: 404 });
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error en GET /api/eval/[id]:", error);
    return NextResponse.json({ error: "Error al obtener evaluación" }, { status: 500 });
  }
}

// PUT - Actualizar una evaluación
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden editar evaluaciones" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { score, status } = body;

    // Verificar que la evaluación existe
    const evaluationExists = await prisma.evaluation.findUnique({
      where: { id }
    });

    if (!evaluationExists) {
      return NextResponse.json({ error: "Evaluación no encontrada" }, { status: 404 });
    }

    // Actualizar la evaluación
    const evaluation = await prisma.evaluation.update({
      where: { id },
      data: {
        score: parseInt(score),
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

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error en PUT /api/eval/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar evaluación" }, { status: 500 });
  }
}

// DELETE - Eliminar una evaluación
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden eliminar evaluaciones" }, { status: 403 });
    }

    const { id } = await params;

    // Verificar que la evaluación existe
    const evaluationExists = await prisma.evaluation.findUnique({
      where: { id }
    });

    if (!evaluationExists) {
      return NextResponse.json({ error: "Evaluación no encontrada" }, { status: 404 });
    }

    // Eliminar la evaluación
    await prisma.evaluation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Evaluación eliminada correctamente" });
  } catch (error) {
    console.error("Error en DELETE /api/eval/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar evaluación" }, { status: 500 });
  }
}