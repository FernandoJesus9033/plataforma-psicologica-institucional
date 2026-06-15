import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verificar rol desde el store de usuarios
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  
  if (!userData) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  
  const user = JSON.parse(userData);
  
  if (user.role !== "STUDENT") {
    return NextResponse.json({ error: "Solo estudiantes pueden subir test" }, { status: 403 });
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
    const fileName = `${timestamp}_${user.email}_${file.name}`;
    
    const store = getStore("test-resultados");
    await store.set(fileName, buffer);

    const resultado = {
      id: crypto.randomUUID(),
      studentEmail: user.email,
      studentName: user.name || "Estudiante",
      archivoNombre: file.name,
      archivoUrl: `/api/archivos/${fileName}`,
      fecha: new Date().toISOString(),
      procesado: false
    };
    await store.setJSON(resultado.id, resultado);

    return NextResponse.json({ success: true, message: "Test subido correctamente" });
  } catch (error) {
    console.error("Error al subir test:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}