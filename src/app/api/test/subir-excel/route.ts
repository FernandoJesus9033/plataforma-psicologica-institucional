import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  let student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    student = await prisma.student.create({
      data: { email: user.email, name: user.name || "Estudiante" }
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("archivo") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: "Solo se permiten archivos .xlsx" }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "tests");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, fileName), buffer);

    const fileUrl = `/uploads/tests/${fileName}`;

    await prisma.testResult.upsert({
      where: { studentId: student.id },
      update: {
        archivoUrl: fileUrl,
        archivoNombre: file.name,
        completedAt: new Date()
      },
      create: {
        studentId: student.id,
        archivoUrl: fileUrl,
        archivoNombre: file.name,
        completedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: "Archivo subido correctamente" });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}