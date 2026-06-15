import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const store = getStore("test-base");
  const archivos = [];

  for await (const item of store.list()) {
    archivos.push({
      key: item.key,
      size: item.size
    });
  }

  return NextResponse.json({ archivos });
}