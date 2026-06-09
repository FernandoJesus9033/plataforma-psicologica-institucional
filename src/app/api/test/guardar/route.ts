import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const student = await prisma.student.findFirst({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { respuestas, grupoActual } = body;

    // Eliminar respuestas anteriores del estudiante
    await prisma.testResponse.deleteMany({
      where: { studentId: student.id }
    });

    // Guardar nuevas respuestas
    for (const respuesta of respuestas) {
      await prisma.testResponse.create({
        data: {
          studentId: student.id,
          groupId: respuesta.groupId,
          selectedPos: respuesta.masParecido,
          selectedNeg: respuesta.menosParecido
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Progreso guardado correctamente",
      grupoActual: grupoActual
    });
  } catch (error) {
    console.error("Error al guardar progreso:", error);
    return NextResponse.json({ 
      error: "Error al guardar el progreso" 
    }, { status: 500 });
  }
}