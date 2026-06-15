import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const store = getStore("test-base");
  
  // Buscar el archivo "current"
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
    }
  }
  
  if (!testBase) {
    return NextResponse.json({ error: "No hay test base disponible" }, { status: 404 });
  }

  const parsed = JSON.parse(testBase);
  return NextResponse.json(parsed);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verificar que sea psicóloga
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  if (!userData) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  
  const user = JSON.parse(userData);
  if (user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "Solo psicólogos pueden subir test base" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("archivo") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: "Solo se permiten archivos .xlsx" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    
    const store = getStore("test-base");
    await store.set(fileName, buffer);

    const testBaseData = {
      id: "current",
      archivoNombre: file.name,
      archivoUrl: `/api/archivos/${encodeURIComponent(fileName)}`,
      activo: true,
      createdAt: new Date().toISOString()
    };

    // Guardar como current
    await store.setJSON("current", testBaseData);

    return NextResponse.json({ success: true, testBase: testBaseData });
  } catch (error) {
    console.error("Error al subir test base:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}