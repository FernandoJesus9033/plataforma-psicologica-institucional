import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar rol del usuario
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // 1. Contar alumnos (usuarios con rol STUDENT)
    const totalAlumnos = await prisma.user.count({
      where: { role: "STUDENT" }
    });

    // 2. Evaluaciones - usando el modelo Evaluation
    const evaluaciones = await prisma.evaluation.findMany({
      include: {
        student: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalEvaluaciones = evaluaciones.length;
    const sumaPuntajes = evaluaciones.reduce((sum, e) => sum + (e.score || 0), 0);
    const promedio = totalEvaluaciones > 0 ? (sumaPuntajes / totalEvaluaciones).toFixed(1) : "0.0";

    // Contar por estado
    const estadoVerde = evaluaciones.filter(e => e.status === "GREEN").length;
    const estadoAmarillo = evaluaciones.filter(e => e.status === "YELLOW").length;
    const estadoRojo = evaluaciones.filter(e => e.status === "RED").length;

    // Últimas 5 evaluaciones
    const ultimasEvaluaciones = evaluaciones.slice(0, 5).map(e => ({
      id: e.id,
      studentName: e.student.name || "Alumno",
      score: e.score
    }));

    // 3. Citas (no canceladas) - usando Appointment
    const hoy = new Date();
    const dentroDe7Dias = new Date();
    dentroDe7Dias.setDate(hoy.getDate() + 7);

    const citas = await prisma.appointment.findMany({
      where: {
        status: { not: "CANCELADA" }
      }
    });

    const totalCitas = citas.length;
    
    // Citas en los próximos 7 días
    const proximasCitas = citas.filter(c => {
      const fechaCita = new Date(c.date);
      return fechaCita >= hoy && fechaCita <= dentroDe7Dias;
    }).length;

    return NextResponse.json({
      totalAlumnos,
      totalEvaluaciones,
      totalCitas,
      promedio,
      estadoVerde,
      estadoAmarillo,
      estadoRojo,
      proximasCitas,
      ultimasEvaluaciones
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json({
      totalAlumnos: 0,
      totalEvaluaciones: 0,
      totalCitas: 0,
      promedio: "0.0",
      estadoVerde: 0,
      estadoAmarillo: 0,
      estadoRojo: 0,
      proximasCitas: 0,
      ultimasEvaluaciones: []
    });
  }
}