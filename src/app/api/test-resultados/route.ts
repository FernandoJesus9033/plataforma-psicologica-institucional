import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  console.log("🔍 Session en test-resultados:", session?.user?.email, "Role:", session?.user?.role);
  
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener el rol REAL desde el store de usuarios
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  
  if (!userData) {
    console.error("❌ Usuario no encontrado en store:", session.user.email);
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  
  const user = JSON.parse(userData);
  console.log("📦 Usuario desde store:", { email: user.email, role: user.role });
  
  // Verificar rol
  if (user.role !== "PSYCHOLOGIST") {
    console.error("❌ Usuario no es psicólogo, rol detectado:", user.role);
    return NextResponse.json({ 
      error: "No autorizado - Se requiere rol PSYCHOLOGIST",
      yourRole: user.role 
    }, { status: 403 });
  }

  try {
    const store = getStore("test-resultados");
    const resultados = [];

    for await (const item of store.list()) {
      // Ignorar archivos que no son JSON (los Excel subidos)
      if (item.key.endsWith('.xlsx')) continue;
      
      const resultado = await store.get(item.key);
      if (resultado) {
        try {
          const parsed = JSON.parse(resultado);
          if (parsed.studentEmail && parsed.archivoNombre) {
            resultados.push({
              id: parsed.id,
              studentName: parsed.studentName,
              studentEmail: parsed.studentEmail,
              archivoNombre: parsed.archivoNombre,
              fecha: parsed.fecha || parsed.createdAt || new Date().toISOString(),
              procesado: parsed.procesado || false
            });
          }
        } catch (e) {
          // No es JSON, ignorar
          console.log("Ignorando archivo no JSON:", item.key);
        }
      }
    }

    resultados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    console.log(`📋 Resultados encontrados: ${resultados.length}`);
    
    return NextResponse.json(resultados);
  } catch (error) {
    console.error("Error en test-resultados:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}