import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    
    const store = getStore("test-resultados");
    await store.set(fileName, buffer);

    // Guardar referencia del resultado
    const resultado = {
      id: crypto.randomUUID(),
      studentEmail: session.user.email,
      studentName: session.user.name,
      archivoNombre: file.name,
      archivoUrl: `/api/archivos/${fileName}`,
      fecha: new Date().toISOString(),
      puntaje: 0 // Pendiente de cálculo
    };
    await store.setJSON(resultado.id, resultado);

    return NextResponse.json({ success: true, message: "Archivo subido correctamente" });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}