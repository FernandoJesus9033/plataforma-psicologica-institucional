import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  try {
    console.log("🚀 [GET /api/test-resultados] Iniciando...");
    
    const session = await getServerSession();
    console.log("📧 Session email:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Obtener el rol del usuario
    let userRole = "STUDENT";
    let userName = "Usuario";
    try {
      const usuariosStore = getStore("usuarios");
      const userData = await usuariosStore.get(session.user.email);
      if (userData) {
        const user = JSON.parse(userData);
        userRole = user.role || "STUDENT";
        userName = user.name || user.nombre || "Usuario";
      }
    } catch (err) {
      console.error("Error obteniendo rol:", err);
    }

    console.log("👤 Rol:", userRole, "Usuario:", userName);

    // Verificar que sea psicólogo
    if (userRole !== "PSYCHOLOGIST") {
      console.log("❌ No autorizado - Se requiere rol PSYCHOLOGIST");
      return NextResponse.json({ 
        error: "No autorizado - Se requiere rol PSYCHOLOGIST",
        yourRole: userRole 
      }, { status: 403 });
    }

    // Conectar al store
    let store;
    try {
      store = getStore("test-resultados");
      console.log("✅ Store 'test-resultados' conectado");
    } catch (err) {
      console.error("❌ Error al conectar store:", err);
      return NextResponse.json([], { status: 200 });
    }

    const resultados = [];
    const archivosMap = new Map();

    try {
      // Recorrer todos los archivos en el store
      for await (const item of store.list()) {
        try {
          const contenido = await store.get(item.key);
          if (!contenido) continue;

          console.log(`📄 Procesando: ${item.key}`);

          // Caso 1: Archivo Excel (.xlsx)
          if (item.key.endsWith('.xlsx')) {
            let studentEmail = "desconocido@email.com";
            let studentName = "Estudiante";
            
            // Intentar extraer email del nombre del archivo
            const emailMatch = item.key.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch) {
              studentEmail = emailMatch[0];
              // Buscar el nombre del estudiante
              try {
                const usuariosStore = getStore("usuarios");
                const estudianteData = await usuariosStore.get(studentEmail);
                if (estudianteData) {
                  const estudiante = JSON.parse(estudianteData);
                  studentName = estudiante.name || estudiante.nombre || estudiante.nombreCompleto || "Estudiante";
                }
              } catch (e) {
                console.error("Error buscando estudiante:", e);
              }
            }
            
            archivosMap.set(item.key, {
              id: item.key,
              studentName: studentName,
              studentEmail: studentEmail,
              archivoNombre: item.key,
              fecha: new Date().toISOString(),
              procesado: true
            });
          }
          
          // Caso 2: Archivo JSON con metadatos
          if (item.key.endsWith('.json') || (contenido.toString().trim().startsWith('{'))) {
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
              console.log("Ignorando archivo no parseable:", item.key);
            }
          }
        } catch (err) {
          console.error("Error procesando item:", item.key, err);
        }
      }
    } catch (err) {
      console.error("Error al listar resultados:", err);
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
    
    console.log(`📊 Resultados encontrados: ${resultados.length}`);
    return NextResponse.json(resultados);
    
  } catch (error) {
    console.error("❌ Error FATAL en GET /api/test-resultados:", error);
    // En caso de error crítico, devolver array vacío
    return NextResponse.json([], { status: 200 });
  }
}