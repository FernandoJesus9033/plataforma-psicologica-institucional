import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET: Obtener entregas del estudiante
export async function GET(req) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  const entregas = await prisma.activity.findMany({
    where: { studentId: student.id, entregadoEn: { not: null } },
    orderBy: { entregadoEn: "desc" }
  });

  return NextResponse.json(entregas);
}

// POST: Subir una entrega (alumno)
export async function POST(req) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    
    // 🔍 Depuración: ver qué campos llegan
    console.log("📥 Campos recibidos:", Array.from(formData.keys()));

    const file = formData.get("file");
    
    // ✅ Aceptar múltiples nombres para el ID de actividad
    const activityId = formData.get("activityId") || 
                       formData.get("id") || 
                       formData.get("activity_id") ||
                       formData.get("actividadId");

    if (!file || !activityId) {
      console.log("❌ Faltan datos:", { file: !!file, activityId });
      return NextResponse.json(
        { error: "Faltan archivo o ID de actividad. Campos recibidos: " + Array.from(formData.keys()).join(", ") },
        { status: 400 }
      );
    }

    // Verificar que la actividad pertenece al estudiante
    const actividad = await prisma.activity.findFirst({
      where: { id: activityId, studentId: student.id }
    });

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada o no te pertenece" }, { status: 404 });
    }

    // Validar tamaño del archivo (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo no debe superar los 10MB" }, { status: 400 });
    }

    // Subir archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads/entregas");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const originalName = file.name;
    const ext = path.extname(originalName);
    const safeName = `${timestamp}${ext}`;
    const filePath = path.join(uploadDir, safeName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/entregas/${safeName}`;

    // Actualizar la actividad con la entrega
    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: {
        entregaUrl: fileUrl,
        entregaNombre: originalName,
        entregaTipo: file.type,
        entregadoEn: new Date(),
        status: "ENTREGADA"
      }
    });

    console.log("✅ Entrega registrada para actividad:", activityId);
    return NextResponse.json({ success: true, actividad: updated });
  } catch (error) {
    console.error("❌ Error al subir entrega:", error);
    return NextResponse.json(
      { error: "Error al subir entrega: " + error.message },
      { status: 500 }
    );
  }
}