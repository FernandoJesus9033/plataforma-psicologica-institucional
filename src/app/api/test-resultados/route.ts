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
      // Solo mostrar los que tienen archivo subido
      if (parsed.archivoUrl) {
        resultados.push({
          id: parsed.id,
          studentName: parsed.studentName,
          studentEmail: parsed.studentEmail,
          fecha: parsed.fecha,
          archivoNombre: parsed.archivoNombre,
          procesado: parsed.procesado
        });
      }
    }
  }

  return NextResponse.json(resultados);
}