import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST() {
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

  const student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  try {
    // Eliminar respuestas anteriores
    await prisma.testResponse.deleteMany({
      where: { studentId: student.id }
    });

    // Eliminar resultado anterior
    await prisma.testResult.deleteMany({
      where: { studentId: student.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Test reiniciado correctamente" 
    });
  } catch (error) {
    console.error("Error al reiniciar test:", error);
    return NextResponse.json({ 
      error: "Error al reiniciar el test" 
    }, { status: 500 });
  }
}