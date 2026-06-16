import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que el directorio existe
    let archivos = [];
    
    try {
      await fs.access(UPLOADS_DIR);
      const files = await fs.readdir(UPLOADS_DIR);
      
      // Filtrar solo archivos Excel
      const excelFiles = files.filter(f => f.endsWith('.xlsx'));
      
      for (const file of excelFiles) {
        const stats = await fs.stat(path.join(UPLOADS_DIR, file));
        archivos.push({
          key: file,
          size: stats.size
        });
      }
    } catch (err) {
      // El directorio no existe aún, devolver lista vacía
      console.log("Directorio uploads no existe aún");
    }

    return NextResponse.json({ archivos });

  } catch (error) {
    console.error("Error al listar archivos:", error);
    return NextResponse.json({ error: "Error al listar archivos" }, { status: 500 });
  }
}