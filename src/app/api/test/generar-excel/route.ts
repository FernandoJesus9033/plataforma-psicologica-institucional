import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";

export async function GET() {
  try {
    // Cargar el Excel original
    const excelPath = path.join(process.cwd(), 'public', 'data', 'Test Gordon P-IPG (automatizado) juan manuel.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    
    // Limpiar todas las respuestas (poner celdas en blanco)
    const worksheet = workbook.getWorksheet("APLICACION Y CONTEO");
    if (worksheet) {
      const rangos = ["B7:B46", "C7:C46", "E7:E46", "F7:F46", "H7:H46", "I7:I46", "K7:K46", "L7:L46"];
      for (const rango of rangos) {
        const [start, end] = rango.split(':');
        const col = start.replace(/\d+$/, '');
        const startRow = parseInt(start.replace(/^\D+/, ''), 10);
        const endRow = parseInt(end.replace(/^\D+/, ''), 10);
        
        for (let row = startRow; row <= endRow; row++) {
          const cell = worksheet.getCell(`${col}${row}`);
          if (cell.value === 1 || cell.value === "1") {
            cell.value = null;
          }
        }
      }
    }
    
    // Generar buffer del archivo
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Devolver como archivo descargable
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="test-gordon-para-completar.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error al generar Excel:", error);
    return NextResponse.json({ error: "Error al generar el archivo" }, { status: 500 });
  }
}