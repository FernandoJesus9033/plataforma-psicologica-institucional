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
    // 1. Contar alumnos desde el store de usuarios
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

    // 2. Obtener evaluaciones (si tienes un store de evaluaciones)
    let totalEvaluaciones = 0;
    let sumaPuntajes = 0;
    let promedioPuntaje = 0;
    
    try {
      const evaluacionesStore = getStore("evaluaciones");
      for await (const item of evaluacionesStore.list()) {
        const evaluacion = await evaluacionesStore.get(item.key);
        if (evaluacion) {
          const parsed = JSON.parse(evaluacion);
          totalEvaluaciones++;
          sumaPuntajes += parsed.score || 0;
        }
      }
      promedioPuntaje = totalEvaluaciones > 0 ? Math.round(sumaPuntajes / totalEvaluaciones) : 0;
    } catch (e) {
      // Si no existe el store, ignorar
    }

    // 3. Contar citas (sin contar las canceladas)
    let totalCitas = 0;
    try {
      const citasStore = getStore("citas");
      for await (const item of citasStore.list()) {
        const cita = await citasStore.get(item.key);
        if (cita) {
          const parsed = JSON.parse(cita);
          if (parsed.estado !== "CANCELADA") {
            totalCitas++;
          }
        }
      }
    } catch (e) {
      // Si no existe el store, ignorar
    }

    return NextResponse.json({
      totalAlumnos,
      totalEvaluaciones,
      totalCitas,
      promedioPuntaje
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json({
      totalAlumnos: 0,
      totalEvaluaciones: 0,
      totalCitas: 0,
      promedioPuntaje: 0
    });
  }
}