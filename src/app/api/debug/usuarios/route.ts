import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  try {
    console.log("🚀 [GET /api/debug/usuarios] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("📧 Usuario:", session.user.email);

    const usuariosStore = getStore("usuarios");
    const usuarios = [];

    // Listar todos los usuarios en el store
    let itemCount = 0;
    for await (const item of usuariosStore.list()) {
      itemCount++;
      console.log(`📄 Procesando item ${itemCount}: ${item.key}`);
      
      try {
        const usuarioRaw = await usuariosStore.get(item.key);
        if (usuarioRaw) {
          try {
            const parsed = JSON.parse(usuarioRaw);
            usuarios.push({
              key: item.key,
              ...parsed
            });
          } catch (parseError) {
            // Si no es JSON válido, guardar el raw
            usuarios.push({ 
              key: item.key, 
              raw: typeof usuarioRaw === 'string' ? usuarioRaw : 'Binary data',
              note: "No se pudo parsear como JSON"
            });
          }
        } else {
          usuarios.push({ 
            key: item.key, 
            note: "No se pudo obtener el contenido"
          });
        }
      } catch (itemError) {
        console.error(`Error procesando ${item.key}:`, itemError);
        usuarios.push({ 
          key: item.key, 
          error: String(itemError)
        });
      }
    }

    console.log(`📊 Total usuarios encontrados: ${usuarios.length}`);
    
    return NextResponse.json({
      total: usuarios.length,
      usuarios: usuarios,
      session: {
        email: session.user.email,
        name: session.user.name
      }
    });
    
  } catch (error) {
    console.error("❌ Error en diagnóstico:", error);
    return NextResponse.json({ 
      error: "Error en diagnóstico",
      details: String(error)
    }, { status: 500 });
  }
}