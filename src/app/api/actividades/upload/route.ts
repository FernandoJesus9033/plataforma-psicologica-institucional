import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

// ✅ Directorio fuera de public/
const UPLOADS_DIR = path.join(process.cwd(), "uploads", "actividades");

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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser || currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("archivo") as File;
    const actividadId = formData.get("actividadId") as string;

    // ✅ Log para depuración
    console.log("📝 Upload - actividadId:", actividadId);
    console.log("📝 Upload - file:", file?.name);

    if (!file || !actividadId) {
      console.error("❌ Faltan datos:", { file: !!file, actividadId });
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
    }

    // Verificar que la actividad existe
    const actividad = await prisma.activity.findUnique({
      where: { id: actividadId }
    });

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    // Guardar archivo en disco (fuera de public/)
    await ensureUploadsDir();
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.writeFile(filePath, buffer);

    // ✅ URL protegida (usa /api/archivos/)
    const fileUrl = `/api/archivos/${encodeURIComponent(fileName)}`;

    // Actualizar la actividad en la base de datos
    await prisma.activity.update({
      where: { id: actividadId },
      data: {
        fileUrl: fileUrl,
        fileName: file.name,
        fileType: file.type
      }
    });

    console.log("✅ Archivo subido a actividad:", fileName, "por", currentUser.email);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      type: file.type
    });

  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}