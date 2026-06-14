import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

// Función simple para calcular percentiles (ejemplo)
function obtenerPercentil(scale: string, score: number): number {
  // Aquí va tu lógica real de percentiles
  return Math.min(99, Math.max(1, Math.floor(score * 3.5)));
}

function calculateScoresDirectly(respuestas: any[]) {
  // Aquí va tu lógica real de cálculo de puntajes
  return { A: 15, R: 16, E: 14, S: 17, AE: 15, C: 13, O: 16, P: 14, V: 15 };
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { respuestas } = body;

    if (!respuestas || respuestas.length === 0) {
      return NextResponse.json({ error: "No hay respuestas para procesar" }, { status: 400 });
    }

    // Calcular puntajes
    const pd = calculateScoresDirectly(respuestas);
    const pc = {
      A: obtenerPercentil("A", pd.A),
      R: obtenerPercentil("R", pd.R),
      E: obtenerPercentil("E", pd.E),
      S: obtenerPercentil("S", pd.S),
      AE: obtenerPercentil("A", pd.AE),
      C: obtenerPercentil("C", pd.C),
      O: obtenerPercentil("O", pd.O),
      P: obtenerPercentil("P", pd.P),
      V: obtenerPercentil("V", pd.V),
    };

    // Guardar en Netlify Blobs
    const store = getStore("test-resultados");
    const resultado = {
      id: crypto.randomUUID(),
      studentEmail: session.user.email,
      studentName: session.user.name,
      scores: pd,
      percentiles: pc,
      completedAt: new Date().toISOString()
    };

    await store.setJSON(resultado.id, resultado);

    return NextResponse.json({ success: true, scores: pd, percentiles: pc });
  } catch (error) {
    console.error("Error al procesar test:", error);
    return NextResponse.json({ error: "Error al procesar el test" }, { status: 500 });
  }
}