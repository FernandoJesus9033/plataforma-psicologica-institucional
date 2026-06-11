import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// GET: Obtener un alumno específico (para editar/ver)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    // Buscar alumno en la tabla User con rol STUDENT
    const student = await prisma.user.findFirst({
      where: {
        id,
        role: "STUDENT"
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    return NextResponse.json({ error: "Error al obtener alumno" }, { status: 500 });
  }
}

// PUT: Actualizar un alumno
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { name, email } = await req.json();

    // Verificar si el nuevo email ya existe en otro alumno
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
        role: "STUDENT"
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo ya está registrado por otro alumno" },
        { status: 400 }
      );
    }

    // Actualizar el usuario
    const updatedStudent = await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    return NextResponse.json({ error: "Error al actualizar alumno" }, { status: 500 });
  }
}

// DELETE: Eliminar un alumno
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    // Primero obtener el alumno para saber su email
    const student = await prisma.user.findUnique({
      where: { id }
    });

    if (!student) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    // Buscar el Student asociado por email
    const studentRecord = await prisma.student.findUnique({
      where: { email: student.email }
    });

    // Eliminar registros relacionados en Student (si existe)
    if (studentRecord) {
      await prisma.testResponse.deleteMany({ where: { studentId: studentRecord.id } });
      await prisma.testResult.deleteMany({ where: { studentId: studentRecord.id } });
      await prisma.appointment.deleteMany({ where: { studentId: studentRecord.id } });
      await prisma.evaluation.deleteMany({ where: { studentId: studentRecord.id } });
      await prisma.activity.deleteMany({ where: { studentId: studentRecord.id } });
      await prisma.student.delete({ where: { id: studentRecord.id } });
    }

    // Eliminar el User
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    return NextResponse.json({ error: "Error al eliminar alumno" }, { status: 500 });
  }
}