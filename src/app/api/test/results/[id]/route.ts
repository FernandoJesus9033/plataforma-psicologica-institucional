import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  const testResult = await prisma.testResult.findUnique({
    where: { studentId: id },
    include: { student: true }
  });

  if (!testResult) {
    return NextResponse.json({ error: "Resultado no encontrado" }, { status: 404 });
  }

  return NextResponse.json(testResult);
}