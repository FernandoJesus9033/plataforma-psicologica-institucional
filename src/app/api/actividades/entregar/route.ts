import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

// ✅ Directorio fuera de public/
const UPLOADS_DIR = path.join(process.cwd(), "uploads", "entregas");

// Asegurar que el directorio existe
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("archivo");
    const actividadId = formData.get("actividadId");

    if (!file || !actividadId) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
    }

    // Verificar que la actividad existe y pertenece al estudiante
    const actividad = await prisma.activity.findUnique({
      where: { id: actividadId }
    });

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    if (actividad.studentId !== currentUser.id && currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
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
        entregaUrl: fileUrl,
        entregaNombre: file.name,
        entregaTipo: file.type,
        entregadoEn: new Date()
      }
    });

    console.log("✅ Entrega subida:", fileName, "por", currentUser.email);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      type: file.type
    });

  } catch (error) {
    console.error("Error al subir entrega:", error);
    return NextResponse.json({ error: "Error al subir la entrega" }, { status: 500 });
  }
}
