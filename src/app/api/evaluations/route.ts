import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

function calculateStatus(score: number): string {
  if (score >= 70) return "GREEN";
  if (score >= 40) return "YELLOW";
  return "RED";
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = getStore("evaluaciones");
    const evaluations: any[] = [];

    for await (const item of store.list()) {
      const evaluacion = await store.get(item.key);
      if (evaluacion) {
        evaluations.push(JSON.parse(evaluacion));
      }
    }

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("Error al obtener evaluaciones:", error);
    return NextResponse.json({ error: "Error al obtener evaluaciones" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = session.user;
    if (user.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, score } = body;

    if (!studentId || score === undefined) {
      return NextResponse.json(
        { error: "Faltan datos: studentId y score son obligatorios" },
        { status: 400 }
      );
    }

    // Obtener datos del estudiante desde el store de usuarios
    const usuariosStore = getStore("usuarios");
    let studentName = "";
    let studentEmail = "";

    // Buscar por email o por ID
    for await (const item of usuariosStore.list()) {
      const usuario = await usuariosStore.get(item.key);
      if (usuario) {
        const parsed = JSON.parse(usuario);
        if (parsed.id === studentId || parsed.email === studentId) {
          studentName = parsed.name;
          studentEmail = parsed.email;
          break;
        }
      }
    }

    if (!studentName) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    const status = calculateStatus(score);
    console.log("✅ Creando evaluación:", { studentId, studentName, score, status });

    const evaluation = {
      id: crypto.randomUUID(),
      studentId: studentId,
      studentName,
      studentEmail,
      score,
      status,
      createdAt: new Date().toISOString()
    };

    const store = getStore("evaluaciones");
    await store.setJSON(evaluation.id, evaluation);

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear evaluación:", error);
    return NextResponse.json({ error: "Error al crear evaluación: " + (error as Error).message }, { status: 500 });
  }
}