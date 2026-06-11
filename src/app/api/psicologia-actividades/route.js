import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req) {
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
    const { title, description, studentId, dueDate, fileUrl, fileName, fileType } = body;

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    const actividad = await prisma.activity.create({
      data: {
        title,
        description: description || "",
        studentId,
        psychologistId: user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        status: "PENDING",
      }
    });

    return NextResponse.json(actividad, { status: 201 });
  } catch (error) {
    console.error("Error al crear actividad:", error);
    return NextResponse.json(
      { error: "Error al crear la actividad: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
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

  let actividades;

  if (user.role === "PSYCHOLOGIST") {
    actividades = await prisma.activity.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" }
    });
  } else {
    const student = await prisma.student.findUnique({
      where: { email: user.email }
    });
    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }
    actividades = await prisma.activity.findMany({
      where: { studentId: student.id },
      include: { student: true },
      orderBy: { createdAt: "desc" }
    });
  }

  return NextResponse.json(actividades);
}