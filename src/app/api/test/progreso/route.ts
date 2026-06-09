import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
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

  // Buscar o crear el estudiante automáticamente
  let student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    student = await prisma.student.create({
      data: {
        email: user.email,
        name: user.name || "Estudiante",
      }
    });
    console.log("✅ Estudiante creado automáticamente:", student);
  }

  const testResult = await prisma.testResult.findUnique({
    where: { studentId: student.id }
  });

  const respuestas = await prisma.testResponse.findMany({
    where: { studentId: student.id },
    orderBy: { groupId: "asc" }
  });

  return NextResponse.json({
    completado: !!testResult,
    respuestas: respuestas.map(r => ({
      groupId: r.groupId,
      masParecido: r.selectedPos ? parseInt(r.selectedPos) : -1,
      menosParecido: r.selectedNeg ? parseInt(r.selectedNeg) : -1
    })),
    grupoActual: respuestas.length,
    totalGrupos: 38
  });
}