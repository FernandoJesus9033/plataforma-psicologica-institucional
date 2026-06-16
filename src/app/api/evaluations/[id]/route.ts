import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

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

    // ✅ Eliminado include: { student: true }
    const evaluation = await prisma.evaluation.findUnique({
      where: { id }
    });

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluación no encontrada" }, { status: 404 });
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error en GET /api/evaluations/[id]:", error);
    return NextResponse.json({ error: "Error al obtener evaluación" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { score, status } = body;

    // ✅ Eliminado include: { student: true }
    const evaluation = await prisma.evaluation.update({
      where: { id },
      data: { score, status }
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error en PUT /api/evaluations/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar evaluación" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.evaluation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE /api/evaluations/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar evaluación" }, { status: 500 });
  }
}