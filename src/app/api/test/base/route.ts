import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const store = getStore("test-base");
  
  // Intentar obtener el test base activo
  let testBase = await store.get("current");
  
  if (!testBase) {
    // Buscar el archivo Excel más reciente
    let latestFile = null;
    let latestTime = 0;
    for await (const item of store.list()) {
      if (item.key !== "current" && item.key.endsWith('.xlsx')) {
        const timestamp = parseInt(item.key.split('_')[0]);
        if (timestamp > latestTime) {
          latestTime = timestamp;
          latestFile = item.key;
        }
      }
    }
    
    if (latestFile) {
      testBase = JSON.stringify({
        id: "current",
        archivoNombre: latestFile,
        archivoUrl: `/api/archivos/${encodeURIComponent(latestFile)}`,
        activo: true,
        createdAt: new Date().toISOString()
      });
      // Guardar como current para futuras consultas
      await store.setJSON("current", JSON.parse(testBase));
    }
  }
  
  if (!testBase) {
    return NextResponse.json({ error: "No hay test base disponible" }, { status: 404 });
  }

  const parsed = JSON.parse(testBase);
  console.log("📦 Test base devuelto:", parsed);
  
  return NextResponse.json(parsed);
}