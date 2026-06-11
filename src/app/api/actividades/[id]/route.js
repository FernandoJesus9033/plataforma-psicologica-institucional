import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// ✅ GET: Ver una actividad específica
export async function GET(req, { params }) {
  const { id } = await params;

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const actividad = await prisma.activity.findUnique({
    where: { id },
    include: { student: true }
  });

  if (!actividad) {
    return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
  }

  // Psicólogo puede ver cualquier actividad
  if (user.role === "PSYCHOLOGIST") {
    return NextResponse.json(actividad);
  }

  // Estudiante solo puede ver sus propias actividades
  const student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student || actividad.studentId !== student.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.json(actividad);
}

// ✅ DELETE: Eliminar una actividad (solo psicólogo)
export async function DELETE(req, { params }) {
  const { id } = await params;

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user || user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    await prisma.activity.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar actividad:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

// ✅ PUT: Guardar retroalimentación (solo psicólogo) - CAMBIA ESTADO A COMPLETED
export async function PUT(req, { params }) {
  const { id } = await params;

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user || user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { comentario } = body;

    const actividad = await prisma.activity.update({
      where: { id },
      data: {
        comentario: comentario || null,
        status: "COMPLETED"  // ← Cambia el estado a COMPLETED
      }
    });

    return NextResponse.json({ success: true, actividad });
  } catch (error) {
    console.error("Error al guardar retroalimentación:", error);
    return NextResponse.json(
      { error: "Error al guardar la retroalimentación: " + error.message },
      { status: 500 }
    );
  }
}