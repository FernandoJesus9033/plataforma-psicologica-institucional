import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

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
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar rol desde PostgreSQL
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (currentUser.role !== "STUDENT") {
      return NextResponse.json({ error: "Acceso denegado. Solo estudiantes pueden realizar el test" }, { status: 403 });
    }

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
      AE: obtenerPercentil("AE", pd.AE),
      C: obtenerPercentil("C", pd.C),
      O: obtenerPercentil("O", pd.O),
      P: obtenerPercentil("P", pd.P),
      V: obtenerPercentil("V", pd.V),
    };

    // Guardar en PostgreSQL
    const testResultado = await prisma.testResult.create({
      data: {
        studentId: currentUser.id,
        scores: JSON.stringify(pd),
        percentiles: JSON.stringify(pc),
        archivoNombre: `test_${currentUser.email}_${Date.now()}.json`
      }
    });

    console.log("✅ Test procesado y guardado:", testResultado.id);

    return NextResponse.json({ 
      success: true, 
      scores: pd, 
      percentiles: pc,
      resultadoId: testResultado.id
    });

  } catch (error) {
    console.error("Error al procesar test:", error);
    return NextResponse.json({ error: "Error al procesar el test: " + (error as Error).message }, { status: 500 });
  }
}