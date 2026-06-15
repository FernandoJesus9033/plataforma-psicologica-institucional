import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  console.log("🔍 [GET /api/test-resultados] Session:", session?.user?.email);
  
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
  
  // Verificar rol - solo psicólogos pueden ver resultados
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
    const archivosMap = new Map(); // Para evitar duplicados

    // Recorrer todos los archivos en el store
    for await (const item of store.list()) {
      const contenido = await store.get(item.key);
      if (!contenido) continue;

      // Caso 1: Es un archivo Excel (.xlsx)
      if (item.key.endsWith('.xlsx')) {
        let studentEmail = "desconocido@email.com";
        let studentName = "Estudiante";
        
        // Intentar extraer el email del nombre del archivo
        // Formato: timestamp_email_nombre.xlsx
        const emailMatch = item.key.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          studentEmail = emailMatch[0];
          // Buscar el nombre del estudiante en el store de usuarios
          const estudianteData = await usuariosStore.get(studentEmail);
          if (estudianteData) {
            try {
              const estudiante = JSON.parse(estudianteData);
              studentName = estudiante.name || estudiante.nombre || estudiante.nombreCompleto || "Estudiante";
            } catch (e) {}
          }
        }
        
        archivosMap.set(item.key, {
          archivoNombre: item.key,
          studentEmail,
          studentName,
          fecha: new Date().toISOString(),
          procesado: true
        });
      }
      
      // Caso 2: Es un archivo JSON con metadatos
      if (item.key.endsWith('.json') || (!item.key.endsWith('.xlsx') && contenido.toString().trim().startsWith('{'))) {
        try {
          const parsed = JSON.parse(contenido.toString());
          if (parsed.archivoNombre && parsed.archivoNombre.endsWith('.xlsx')) {
            archivosMap.set(parsed.archivoNombre, {
              id: parsed.id || item.key,
              studentName: parsed.studentName || "Estudiante",
              studentEmail: parsed.studentEmail || "desconocido@email.com",
              archivoNombre: parsed.archivoNombre,
              fecha: parsed.fecha || parsed.createdAt || new Date().toISOString(),
              procesado: parsed.procesado || true
            });
          } else if (parsed.studentEmail && !archivosMap.has(item.key)) {
            // Es un resultado sin archivo Excel asociado
            archivosMap.set(item.key, {
              id: parsed.id || item.key,
              studentName: parsed.studentName || "Estudiante",
              studentEmail: parsed.studentEmail,
              archivoNombre: parsed.archivoNombre || `${parsed.studentEmail}_test.json`,
              fecha: parsed.fecha || parsed.createdAt || new Date().toISOString(),
              procesado: parsed.procesado || false
            });
          }
        } catch (e) {
          // No es JSON válido, ignorar
          console.log("Ignorando archivo no parseable:", item.key);
        }
      }
    }

    // Convertir el Map a array
    for (const [key, value] of archivosMap) {
      resultados.push({
        id: value.id || key,
        studentName: value.studentName,
        studentEmail: value.studentEmail,
        archivoNombre: value.archivoNombre,
        fecha: value.fecha,
        procesado: value.procesado || true
      });
    }

    // Ordenar por fecha más reciente
    resultados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    console.log(`📋 Resultados encontrados: ${resultados.length}`);
    return NextResponse.json(resultados);
    
  } catch (error) {
    console.error("Error en test-resultados:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}