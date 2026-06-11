import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads/actividades");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const originalName = file.name;
    const ext = path.extname(originalName);
    const safeName = `${timestamp}${ext}`;
    const filePath = path.join(uploadDir, safeName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/actividades/${safeName}`;

    return NextResponse.json({
      url: fileUrl,
      name: originalName,
      type: file.type
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}