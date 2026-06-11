import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

function getPercentil(puntaje: number): number {
  if (puntaje >= 37) return 99;
  if (puntaje >= 36) return 98;
  if (puntaje >= 35) return 98;
  if (puntaje >= 34) return 98;
  if (puntaje >= 33) return 98;
  if (puntaje >= 32) return 99;
  if (puntaje >= 31) return 98;
  if (puntaje >= 30) return 96;
  if (puntaje >= 29) return 93;
  if (puntaje >= 28) return 89;
  if (puntaje >= 27) return 84;
  if (puntaje >= 26) return 79;
  if (puntaje >= 25) return 73;
  if (puntaje >= 24) return 67;
  if (puntaje >= 23) return 61;
  if (puntaje >= 22) return 54;
  if (puntaje >= 21) return 47;
  if (puntaje >= 20) return 41;
  if (puntaje >= 19) return 35;
  if (puntaje >= 18) return 29;
  if (puntaje >= 17) return 23;
  if (puntaje >= 16) return 18;
  if (puntaje >= 15) return 14;
  if (puntaje >= 14) return 11;
  if (puntaje >= 13) return 8;
  if (puntaje >= 12) return 5;
  if (puntaje >= 11) return 3;
  if (puntaje >= 10) return 2;
  if (puntaje >= 9) return 1;
  if (puntaje >= 8) return 0;
  return 0;
}

function calculateScores(respuestas: any[]) {
  const scores = { A: 0, R: 0, E: 0, S: 0, AE: 0, C: 0, O: 0, P: 0, V: 0 };
  
  respuestas.forEach((respuesta) => {
    const groupId = respuesta.groupId;
    if (groupId >= 0 && groupId <= 8) {
      if (groupId === 0 || groupId === 4) scores.A += 1;
      else if (groupId === 1 || groupId === 5) scores.R += 1;
      else if (groupId === 2 || groupId === 6) scores.E += 1;
      else if (groupId === 3 || groupId === 7 || groupId === 8) scores.S += 1;
    } 
    else if (groupId >= 9 && groupId <= 17) {
      if (groupId === 9 || groupId === 13) scores.AE += 1;
      else if (groupId === 10 || groupId === 14) scores.C += 1;
      else if (groupId === 11 || groupId === 15) scores.O += 1;
      else if (groupId === 12 || groupId === 16 || groupId === 17) scores.P += 1;
    }
    else {
      scores.V += 1;
    }
  });
  return scores;
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

  try {
    const body = await req.json();
    const { respuestas } = body;

    if (!respuestas || respuestas.length === 0) {
      return NextResponse.json({ error: "No hay respuestas para procesar" }, { status: 400 });
    }

    const scores = calculateScores(respuestas);
    const percentiles = {
      A: getPercentil(scores.A), R: getPercentil(scores.R), E: getPercentil(scores.E),
      S: getPercentil(scores.S), AE: getPercentil(scores.AE), C: getPercentil(scores.C),
      O: getPercentil(scores.O), P: getPercentil(scores.P), V: getPercentil(scores.V)
    };

    const existingResult = await prisma.testResult.findUnique({
      where: { studentId: student.id }
    });

    if (existingResult) {
      await prisma.testResult.update({
        where: { studentId: student.id },
        data: { scores: JSON.stringify(scores), percentiles: JSON.stringify(percentiles), completedAt: new Date() }
      });
    } else {
      await prisma.testResult.create({
        data: { studentId: student.id, scores: JSON.stringify(scores), percentiles: JSON.stringify(percentiles), completedAt: new Date() }
      });
    }

    await prisma.testResponse.deleteMany({ where: { studentId: student.id } });

    return NextResponse.json({ success: true, scores, percentiles });
  } catch (error) {
    console.error("Error al finalizar test:", error);
    return NextResponse.json({ error: "Error al procesar el test" }, { status: 500 });
  }
}