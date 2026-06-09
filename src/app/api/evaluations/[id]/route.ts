import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Obtener evaluación por ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    include: { student: true }
  });

  if (!evaluation) {
    return NextResponse.json({ error: "Evaluación no encontrada" }, { status: 404 });
  }

  return NextResponse.json(evaluation);
}

// Actualizar evaluación
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { score, status } = await req.json();

    const evaluation = await prisma.evaluation.update({
      where: { id },
      data: { score, status }
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error al actualizar:", error);
    return NextResponse.json({ error: "Error al actualizar la evaluación" }, { status: 500 });
  }
}

// Eliminar evaluación
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  
  console.log("===== DEBUG DELETE =====");
  console.log("Email:", session?.user?.email);
  console.log("Rol:", session?.user?.role);
  console.log("=========================");

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    console.log("Eliminando evaluación con ID:", id);
    
    // Verificar si existe antes de eliminar
    const existe = await prisma.evaluation.findUnique({ where: { id } });
    if (!existe) {
      console.log("⚠️ Evaluación no encontrada, puede que ya haya sido eliminada");
      return NextResponse.json({ message: "Evaluación ya eliminada o no existe" }, { status: 200 });
    }
    
    await prisma.evaluation.delete({ where: { id } });
    console.log("✅ Evaluación eliminada correctamente");
    return NextResponse.json({ message: "Evaluación eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
    return NextResponse.json({ error: "Error al eliminar la evaluación" }, { status: 500 });
  }
}