import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import ExcelJS from "exceljs";
import { obtenerPercentil } from "@/lib/excel/config/tablaPercentiles";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined }
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

    // Validar extensión
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: "Solo se permiten archivos .xlsx" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(uint8Array);
    
    const worksheet = workbook.getWorksheet("APLICACION Y CONTEO");
    if (!worksheet) {
      return NextResponse.json({ error: "Hoja 'APLICACION Y CONTEO' no encontrada" }, { status: 400 });
    }

    // Leer puntajes directos (PD) de las celdas O12, P12, Q12, R12, S12, T12, U12, V12, W12
    const pd = {
      A: worksheet.getCell("O12").value as number || 0,
      R: worksheet.getCell("P12").value as number || 0,
      E: worksheet.getCell("Q12").value as number || 0,
      S: worksheet.getCell("R12").value as number || 0,
      AE: worksheet.getCell("S12").value as number || 0,
      C: worksheet.getCell("T12").value as number || 0,
      O: worksheet.getCell("U12").value as number || 0,
      P: worksheet.getCell("V12").value as number || 0,
      V: worksheet.getCell("W12").value as number || 0,
    };

    // Leer percentiles (PC) de las celdas O13, P13, Q13, R13, S13, T13, U13, V13, W13
    const pc = {
      A: worksheet.getCell("O13").value as number || 0,
      R: worksheet.getCell("P13").value as number || 0,
      E: worksheet.getCell("Q13").value as number || 0,
      S: worksheet.getCell("R13").value as number || 0,
      AE: worksheet.getCell("S13").value as number || 0,
      C: worksheet.getCell("T13").value as number || 0,
      O: worksheet.getCell("U13").value as number || 0,
      P: worksheet.getCell("V13").value as number || 0,
      V: worksheet.getCell("W13").value as number || 0,
    };

    // Guardar en base de datos
    await prisma.testResult.upsert({
      where: { studentId: student.id },
      update: { 
        scores: JSON.stringify(pd), 
        percentiles: JSON.stringify(pc), 
        completedAt: new Date() 
      },
      create: { 
        studentId: student.id, 
        scores: JSON.stringify(pd), 
        percentiles: JSON.stringify(pc), 
        completedAt: new Date() 
      }
    });

    return NextResponse.json({ 
      success: true, 
      scores: pd,
      percentiles: pc
    });
  } catch (error) {
    console.error("Error al procesar Excel:", error);
    return NextResponse.json({ error: "Error al procesar el archivo: " + (error as Error).message }, { status: 500 });
  }
}