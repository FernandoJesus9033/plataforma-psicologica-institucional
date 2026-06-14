import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nombre: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { nombre } = await params;
  const store = getStore("test-base");
  const fileBuffer = await store.get(nombre);

  if (!fileBuffer) {
    // Buscar también en otros stores si es necesario
    const actividadesStore = getStore("archivos");
    const actividadFile = await actividadesStore.get(nombre);
    if (actividadFile) {
      return new NextResponse(actividadFile, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${nombre}"`
        }
      });
    }
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${nombre}"`
    }
  });
}