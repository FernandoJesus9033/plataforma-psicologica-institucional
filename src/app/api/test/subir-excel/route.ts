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

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar rol desde PostgreSQL
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (currentUser.role !== "STUDENT") {
      return NextResponse.json({ error: "Solo estudiantes pueden subir test" }, { status: 403 });
    }

    // Buscar el estudiante asociado
    const student = await prisma.student.findUnique({
      where: { email: currentUser.email }
    });

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
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
    const fileName = `${timestamp}_${currentUser.email}_${safeName}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.writeFile(filePath, buffer);

    const archivoUrl = `/api/archivos/${encodeURIComponent(fileName)}`;

    // ✅ Usar upsert para evitar error de unicidad
    const resultado = await prisma.testResult.upsert({
      where: { studentId: student.id },
      update: {
        archivoNombre: fileName,  // ✅ Guarda el nombre completo
        archivoUrl: archivoUrl
      },
      create: {
        studentId: student.id,
        archivoNombre: fileName,  // ✅ Guarda el nombre completo
        archivoUrl: archivoUrl
      }
    });

    console.log("✅ Test subido/actualizado:", resultado.id, "por", currentUser.email);
    console.log("📂 Archivo guardado como:", fileName);

    return NextResponse.json({ 
      success: true, 
      message: "Test subido correctamente",
      resultado: {
        id: resultado.id,
        archivoNombre: resultado.archivoNombre,
        archivoUrl: resultado.archivoUrl,
        fecha: resultado.completedAt
      }
    });

  } catch (error) {
    console.error("Error al subir test:", error);
    return NextResponse.json({ error: "Error al subir el archivo: " + (error as Error).message }, { status: 500 });
  }
}