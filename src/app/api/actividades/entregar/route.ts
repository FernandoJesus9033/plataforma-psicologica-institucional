import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads", "entregas");

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

    const userEmail = session.user.email;
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("archivo") as File;
    const actividadId = formData.get("actividadId") as string;

    console.log("📝 Entregar - actividadId:", actividadId);
    console.log("📝 Entregar - file:", file?.name);
    console.log("📝 Entregar - currentUser.id:", currentUser.id);

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

    console.log("📝 actividad.studentId:", actividad.studentId);

    // ✅ Verificar que el usuario sea el estudiante asignado o psicólogo
    // Buscar al estudiante por email para obtener su ID correcto
    const estudiante = await prisma.student.findUnique({
      where: { email: userEmail },
      select: { id: true }
    });

    if (!estudiante) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    console.log("📝 estudiante.id:", estudiante.id);

    // ✅ Comparar con el ID del estudiante en la actividad
    if (actividad.studentId !== estudiante.id && currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado para entregar esta actividad" }, { status: 403 });
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

    console.log("✅ Entrega subida:", fileName);

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