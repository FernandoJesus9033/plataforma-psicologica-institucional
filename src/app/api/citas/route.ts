import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined }
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  if (user.role === "PSYCHOLOGIST") {
    const citas = await prisma.appointment.findMany({
      include: { student: true },
      orderBy: { date: "desc" }
    });
    return NextResponse.json(citas);
  }

  // Estudiante
  const student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  const citas = await prisma.appointment.findMany({
    where: { studentId: student.id },
    orderBy: { date: "desc" }
  });

  return NextResponse.json(citas);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined }
  });

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { date, motivo } = body;

    if (!date) {
      return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
    }

    const cita = await prisma.appointment.create({
      data: {
        studentId: student.id,
        date: new Date(date),
        motivo: motivo || null
      }
    });

    return NextResponse.json(cita, { status: 201 });
  } catch (error) {
    console.error("Error al crear cita:", error);
    return NextResponse.json({ error: "Error al crear la cita" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined }
  });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de cita requerido" }, { status: 400 });
  }

  try {
    // Verificar permisos
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