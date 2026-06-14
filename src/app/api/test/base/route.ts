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
  console.log("🔍 Session user:", session?.user);
  
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // 🔧 Obtener el usuario directamente del store de usuarios
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user?.email);
  
  if (!userData) {
    return NextResponse.json({ error: "Usuario no encontrado en store" }, { status: 404 });
  }
  
  const user = JSON.parse(userData);
  console.log("📦 Usuario desde store:", { email: user.email, role: user.role });
  
  if (user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ 
      error: "No autorizado. Rol detectado: " + (user.role || "ninguno"),
      role: user.role
    }, { status: 403 });
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const store = getStore("test-base");
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    
    await store.set(fileName, buffer);

    const fileUrl = `/api/archivos/${fileName}`;
    
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