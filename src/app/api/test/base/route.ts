import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const testBase = await prisma.testBase.findFirst({
    where: { activo: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(testBase);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user?.email ?? undefined } });
  if (user?.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("archivo") as File;
    if (!file) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: "Solo se permiten archivos .xlsx" }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "test-base");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, fileName), buffer);
    const fileUrl = `/uploads/test-base/${fileName}`;

    await prisma.testBase.updateMany({ where: { activo: true }, data: { activo: false } });
    const testBase = await prisma.testBase.create({
      data: { archivoUrl: fileUrl, archivoNombre: file.name, activo: true }
    });

    return NextResponse.json({ success: true, testBase });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}