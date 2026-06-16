import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";

// Directorio donde se guardarán los archivos (fuera de public/)
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nombre: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { nombre } = await params;
    const decodedNombre = decodeURIComponent(nombre);
    console.log("📥 Buscando archivo:", decodedNombre);

    // Validar que el nombre no contenga path traversal (seguridad)
    const safeName = path.basename(decodedNombre);
    const filePath = path.join(UPLOADS_DIR, safeName);
    
    // Verificar que el archivo esté dentro del directorio de uploads (seguridad)
    if (!filePath.startsWith(UPLOADS_DIR)) {
      console.error("❌ Intento de path traversal detectado:", decodedNombre);
      return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
    }

    // Verificar si el archivo existe
    try {
      await fs.access(filePath);
    } catch {
      console.error("❌ Archivo no encontrado:", filePath);
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }

    // Leer el archivo
    const fileBuffer = await fs.readFile(filePath);

    // Determinar el tipo de contenido
    let contentType = "application/octet-stream";
    const ext = path.extname(decodedNombre).toLowerCase();
    
    if (ext === '.xlsx') {
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (ext === '.xls') {
      contentType = "application/vnd.ms-excel";
    } else if (ext === '.pdf') {
      contentType = "application/pdf";
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = "image/jpeg";
    } else if (ext === '.png') {
      contentType = "image/png";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(decodedNombre)}"`,
        "Cache-Control": "public, max-age=31536000"
      }
    });
    
  } catch (error) {
    console.error("❌ Error al servir archivo:", error);
    return NextResponse.json({ error: "Error al obtener el archivo" }, { status: 500 });
  }
}