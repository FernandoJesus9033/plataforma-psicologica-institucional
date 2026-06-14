import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    // 1. Contar alumnos
    const usuariosStore = getStore("usuarios");
    let totalAlumnos = 0;
    for await (const item of usuariosStore.list()) {
      const usuario = await usuariosStore.get(item.key);
      if (usuario) {
        const parsed = JSON.parse(usuario);
        if (parsed.role === "STUDENT") {
          totalAlumnos++;
        }
      }
    }

    // 2. Evaluaciones (si existen)
    let totalEvaluaciones = 0;
    let sumaPuntajes = 0;
    let estadoVerde = 0, estadoAmarillo = 0, estadoRojo = 0;
    let ultimasEvaluaciones: any[] = [];
    
    try {
      const evaluacionesStore = getStore("evaluaciones");
      for await (const item of evaluacionesStore.list()) {
        const evaluacion = await evaluacionesStore.get(item.key);
        if (evaluacion) {
          const parsed = JSON.parse(evaluacion);
          totalEvaluaciones++;
          sumaPuntajes += parsed.score || 0;
          
          if (parsed.status === "GREEN") estadoVerde++;
          else if (parsed.status === "YELLOW") estadoAmarillo++;
          else estadoRojo++;
          
          ultimasEvaluaciones.push({
            id: parsed.id,
            studentName: parsed.studentName || "Alumno",
            score: parsed.score
          });
        }
      }
      ultimasEvaluaciones = ultimasEvaluaciones.slice(0, 5);
    } catch (e) {}

    const promedio = totalEvaluaciones > 0 ? (sumaPuntajes / totalEvaluaciones).toFixed(1) : "0.0";

    // 3. Citas
    let totalCitas = 0;
    let proximasCitas = 0;
    try {
      const citasStore = getStore("citas");
      for await (const item of citasStore.list()) {
        const cita = await citasStore.get(item.key);
        if (cita) {
          const parsed = JSON.parse(cita);
          if (parsed.estado !== "CANCELADA") {
            totalCitas++;
            const fechaCita = new Date(parsed.fecha);
            if (fechaCita >= new Date() && fechaCita <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
              proximasCitas++;
            }
          }
        }
      }
    } catch (e) {}

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