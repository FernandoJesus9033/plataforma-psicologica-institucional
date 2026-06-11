import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const actividad = await prisma.activity.findUnique({
    where: { id },
    select: { entregaNombre: true }
  });

  return NextResponse.json({ nombre: actividad?.entregaNombre });
}