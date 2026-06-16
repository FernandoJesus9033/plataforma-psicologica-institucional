import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Asegurar que el directorio existe
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Buscar el test base activo en PostgreSQL
    let testBase = await prisma.testBase.findFirst({
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!testBase) {
      return NextResponse.json({ error: "No hay test base disponible" }, { status: 404 });
    }

    return NextResponse.json({
      id: testBase.id,
      archivoNombre: testBase.archivoNombre,
      archivoUrl: testBase.archivoUrl,
      activo: testBase.activo,
      createdAt: testBase.createdAt.toISOString()
    });

  } catch (error) {
    console.error("Error en GET /api/test/base:", error);
    return NextResponse.json({ error: "Error al obtener test base" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que sea psicóloga
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "Solo psicólogos pueden subir test base" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("archivo") as File;

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: "Solo se permiten archivos .xlsx" }, { status: 400 });
    }

    // Guardar archivo en disco
    await ensureUploadsDir();
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.writeFile(filePath, buffer);

    const archivoUrl = `/api/archivos/${encodeURIComponent(fileName)}`;

    // Desactivar todos los tests base anteriores
    await prisma.testBase.updateMany({
      where: { activo: true },
      data: { activo: false }
    });

    // Crear nuevo test base en PostgreSQL
    const testBaseData = await prisma.testBase.create({
      data: {
        archivoNombre: file.name,
        archivoUrl: archivoUrl,
        activo: true
      }
    });

    console.log("✅ Test base subido:", testBaseData.id);

    return NextResponse.json({ 
      success: true, 
      testBase: {
        id: testBaseData.id,
        archivoNombre: testBaseData.archivoNombre,
        archivoUrl: testBaseData.archivoUrl,
        activo: testBaseData.activo,
        createdAt: testBaseData.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error("Error al subir test base:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}