import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (user?.role !== "STUDENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const actividadId = formData.get("actividadId") as string;

    if (!file || !actividadId) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const actividad = await prisma.activity.findFirst({
      where: { id: actividadId, studentId: student.id }
    });

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "entregas");

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, fileName), buffer);

    const fileUrl = `/uploads/entregas/${fileName}`;

    const actividadActualizada = await prisma.activity.update({
      where: { id: actividadId },
      data: {
        entregaUrl: fileUrl,
        entregaNombre: file.name,
        entregaTipo: file.type,
        entregadoEn: new Date(),
        status: "PENDING_REVIEW"
      }
    });

    return NextResponse.json({
      success: true,
      actividad: actividadActualizada,
      fileUrl,
      fileName: file.name
    });
  } catch (error) {
    console.error("Error al subir entrega:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}