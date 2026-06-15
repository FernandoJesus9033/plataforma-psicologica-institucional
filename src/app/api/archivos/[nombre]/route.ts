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
  const decodedNombre = decodeURIComponent(nombre);
  console.log("📥 Buscando archivo:", decodedNombre);
  
  // Buscar en test-base
  const store = getStore("test-base");
  let fileBuffer = await store.get(decodedNombre);
  
  if (!fileBuffer) {
    console.error("❌ Archivo no encontrado:", decodedNombre);
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  let contentType = "application/octet-stream";
  if (decodedNombre.endsWith('.xlsx')) {
    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${decodedNombre}"`,
      "Cache-Control": "public, max-age=31536000"
    }
  });
}