import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const store = getStore("test-resultados");
  const resultados = [];

  for await (const item of store.list()) {
    const resultado = await store.get(item.key);
    if (resultado) {
      const parsed = JSON.parse(resultado);
      // Mostrar todos los resultados subidos por estudiantes
      if (parsed.studentEmail && parsed.archivoNombre) {
        resultados.push({
          id: parsed.id,
          studentName: parsed.studentName,
          studentEmail: parsed.studentEmail,
          archivoNombre: parsed.archivoNombre,
          fecha: parsed.fecha,
          procesado: parsed.procesado || false
        });
      }
    }
  }

  // Ordenar por fecha más reciente
  resultados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return NextResponse.json(resultados);
}