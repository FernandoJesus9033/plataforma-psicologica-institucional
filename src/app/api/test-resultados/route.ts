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

  const store = getStore("test-resultados");
  const resultados: any[] = [];

  for await (const item of store.list()) {
    const resultado = await store.get(item.key);
    if (resultado) {
      const parsed = JSON.parse(resultado);
      // Solo incluir si hay datos del estudiante (por compatibilidad)
      if (parsed.studentName || parsed.studentEmail) {
        resultados.push(parsed);
      }
    }
  }

  return NextResponse.json(resultados.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  ));
}