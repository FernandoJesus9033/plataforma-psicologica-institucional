import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  try {
    const { entregaUrl, entregaNombre, entregaTipo } = await req.json();
    const actividad = await prisma.activity.update({
      where: { id: params.id },
      data: {
        entregaUrl,
        entregaNombre,
        entregaTipo,
        entregadoEn: new Date(),
        status: "ENTREGADA"
      }
    });
    return NextResponse.json(actividad);
  } catch (error) {
    return NextResponse.json({ error: "Error al entregar" }, { status: 500 });
  }
}