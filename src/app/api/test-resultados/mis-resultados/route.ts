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

  const student = await prisma.student.findFirst({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  const testResult = await prisma.testResult.findUnique({
    where: { studentId: student.id }
  });

  if (!testResult) {
    return NextResponse.json({ error: "No hay resultados" }, { status: 404 });
  }

  let scores = {};
  try {
    scores = JSON.parse(testResult.scores);
  } catch (e) {
    console.error("Error parsing scores:", e);
  }

  return NextResponse.json({
    id: testResult.id,
    scores: scores,
    completedAt: testResult.completedAt
  });
}