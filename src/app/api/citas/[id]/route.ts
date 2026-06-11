import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined }
  });

  if (user?.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  try {
    const cita = await prisma.appointment.update({
      where: { id },
      data: { status: status || "CONFIRMED" }
    });

    return NextResponse.json(cita);
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    return NextResponse.json({ error: "Error al actualizar la cita" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined }
  });

  const { id } = await params;

  try {
    if (user?.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { email: user.email }
      });

      const cita = await prisma.appointment.findFirst({
        where: { id, studentId: student?.id }
      });

      if (!cita) {
        return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
      }
    }

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return NextResponse.json({ error: "Error al eliminar la cita" }, { status: 500 });
  }
}