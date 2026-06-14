import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const store = getStore("test-base");
  const testBase = await store.get("current");

  if (!testBase) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(JSON.parse(testBase));
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = session.user;
  if (user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("archivo") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }
    
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: "Solo se permiten archivos .xlsx" }, { status: 400 });
    }

    // Leer el archivo como buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Guardar en Netlify Blobs
    const store = getStore("test-base");
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    
    await store.set(fileName, buffer);

    const fileUrl = `/api/archivos/${fileName}`;
    
    // Guardar la referencia del test base activo
    const testBaseData = {
      id: "current",
      archivoNombre: file.name,
      archivoUrl: fileUrl,
      activo: true,
      createdAt: new Date().toISOString()
    };

    await store.setJSON("current", testBaseData);

    return NextResponse.json({ success: true, testBase: testBaseData });
  } catch (error) {
    console.error("Error al subir test base:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}