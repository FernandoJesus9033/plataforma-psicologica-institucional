import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const tipo = formData.get("tipo") || "general";

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = `${timestamp}_${file.name}`;
    
    const store = getStore("archivos");
    await store.set(safeName, buffer);

    const fileUrl = `/api/archivos/${safeName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      type: file.type
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}