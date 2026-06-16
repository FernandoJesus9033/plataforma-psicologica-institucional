import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nombre: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const { nombre } = await params;
    const decodedNombre = decodeURIComponent(nombre);

    const safeName = path.basename(decodedNombre);
    const filePath = path.join(UPLOADS_DIR, safeName);
    
    if (!filePath.startsWith(UPLOADS_DIR)) {
      return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
    }

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }

    // ✅ SI ES PSICÓLOGO -> PERMITIR DESCARGA
    // ✅ SI ES ESTUDIANTE -> VERIFICAR QUE SEA SU ARCHIVO
    if (currentUser.role !== "PSYCHOLOGIST") {
      const student = await prisma.student.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (!student) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }

      const archivoRelacionado = await prisma.activity.findFirst({
        where: {
          studentId: student.id,
          OR: [
            { fileUrl: { contains: safeName } },
            { entregaUrl: { contains: safeName } }
          ]
        }
      });

      // Verificar si es un resultado de test
      const testResult = await prisma.testResult.findFirst({
        where: {
          studentId: student.id,
          archivoUrl: { contains: safeName }
        }
      });

      if (!archivoRelacionado && !testResult) {
        return NextResponse.json({ error: "No autorizado para descargar este archivo" }, { status: 403 });
      }
    }

    const fileBuffer = await fs.readFile(filePath);

    let contentType = "application/octet-stream";
    const ext = path.extname(decodedNombre).toLowerCase();
    
    if (ext === '.xlsx') {
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (ext === '.xls') {
      contentType = "application/vnd.ms-excel";
    } else if (ext === '.pdf') {
      contentType = "application/pdf";
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = "image/jpeg";
    } else if (ext === '.png') {
      contentType = "image/png";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(decodedNombre)}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
    
  } catch (error) {
    console.error("❌ Error al servir archivo:", error);
    return NextResponse.json({ error: "Error al obtener el archivo" }, { status: 500 });
  }
}