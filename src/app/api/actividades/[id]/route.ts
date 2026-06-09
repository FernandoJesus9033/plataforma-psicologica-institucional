import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";

// GET - Obtener actividad específica
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  const actividad = await prisma.activity.findUnique({
    where: { id },
    include: { student: true }
  });

  if (!actividad) {
    return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
  }

  return NextResponse.json(actividad);
}

// PUT - Actualizar calificación
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (user?.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { calificacion, comentario, status } = body;

  const actividad = await prisma.activity.update({
    where: { id },
    data: {
      calificacion,
      comentario,
      status: status || "COMPLETED"
    }
  });

  return NextResponse.json(actividad);
}

// DELETE - Eliminar actividad (solo psicóloga)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (user?.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  try {
    // Obtener la actividad para eliminar archivos asociados
    const actividad = await prisma.activity.findUnique({
      where: { id }
    });

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    // Eliminar archivo adjunto si existe
    if (actividad.fileUrl) {
      const filePath = path.join(process.cwd(), "public", actividad.fileUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log("Archivo no encontrado o ya eliminado");
      }
    }

    // Eliminar archivo de entrega si existe
    if (actividad.entregaUrl) {
      const entregaPath = path.join(process.cwd(), "public", actividad.entregaUrl);
      try {
        await fs.unlink(entregaPath);
      } catch (err) {
        console.log("Archivo de entrega no encontrado");
      }
    }

    // Eliminar la actividad de la base de datos
    await prisma.activity.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Actividad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar actividad:", error);
    return NextResponse.json({ error: "Error al eliminar la actividad" }, { status: 500 });
  }
}