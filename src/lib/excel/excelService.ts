import ExcelJS from "exceljs";
import path from "path";
import fs from "fs/promises";
import { RespuestaUsuario, ResultadoExcel } from "./types";
import { obtenerCelda, CELDAS_RESULTADOS } from "./excelMapper";

// Ruta del archivo Excel original (con el nombre correcto de tu archivo)
const EXCEL_ORIGINAL = path.join(process.cwd(), "public", "data", "Test Gordon P-IPG (automatizado) juan manuel.xlsx");

// Ruta de la copia de trabajo
const EXCEL_TRABAJO = path.join(process.cwd(), "public", "data", "temp", `test-${Date.now()}.xlsx`);

export class ExcelService {
  
  static async crearCopiaTrabajo(): Promise<string> {
    const dir = path.dirname(EXCEL_TRABAJO);
    await fs.mkdir(dir, { recursive: true });
    await fs.copyFile(EXCEL_ORIGINAL, EXCEL_TRABAJO);
    return EXCEL_TRABAJO;
  }

  static async limpiarRespuestas(workbook: ExcelJS.Workbook): Promise<void> {
    const worksheet = workbook.getWorksheet("APLICACION Y CONTEO");
    if (!worksheet) throw new Error("Hoja 'APLICACION Y CONTEO' no encontrada");
    
    for (let row = 7; row <= 46; row++) {
      const columnas = ["B", "C", "E", "F", "H", "I", "K", "L"];
      for (const col of columnas) {
        const celda = worksheet.getCell(`${col}${row}`);
        if (celda.value === 1 || celda.value === "1") {
          celda.value = null;
        }
      }
    }
  }

  static async escribirRespuestas(workbook: ExcelJS.Workbook, respuestas: RespuestaUsuario[]): Promise<void> {
    const worksheet = workbook.getWorksheet("APLICACION Y CONTEO");
    if (!worksheet) throw new Error("Hoja 'APLICACION Y CONTEO' no encontrada");
    
    for (const respuesta of respuestas) {
      const celda = obtenerCelda(respuesta);
      if (celda) {
        worksheet.getCell(celda).value = 1;
      }
    }
  }

  static async leerResultados(workbook: ExcelJS.Workbook): Promise<ResultadoExcel> {
    const worksheet = workbook.getWorksheet("APLICACION Y CONTEO");
    if (!worksheet) throw new Error("Hoja 'APLICACION Y CONTEO' no encontrada");
    
    const pd = CELDAS_RESULTADOS.pd;
    const pc = CELDAS_RESULTADOS.pc;
    
    const nombre = worksheet.getCell("A2").value as string || "Estudiante";
    const fecha = worksheet.getCell("A3").value as string || new Date().toLocaleDateString();
    
    return {
      nombre,
      fecha,
      ppg: {
        ascendencia: worksheet.getCell(pd.ascendencia).value as number || 0,
        responsabilidad: worksheet.getCell(pd.responsabilidad).value as number || 0,
        estabilidad_emocional: worksheet.getCell(pd.estabilidadEmocional).value as number || 0,
        sociabilizacion: worksheet.getCell(pd.sociabilizacion).value as number || 0,
      },
      ipg: {
        autoestima: worksheet.getCell(pd.autoestima).value as number || 0,
        cautela: worksheet.getCell(pd.cautela).value as number || 0,
        originalidad: worksheet.getCell(pd.originalidad).value as number || 0,
        relaciones_interpersonales: worksheet.getCell(pd.relacionesInterpersonales).value as number || 0,
        vigor: worksheet.getCell(pd.vigor).value as number || 0,
      },
      percentiles: {
        pd: [],
        pc: [
          worksheet.getCell(pc.ascendencia).value as number || 0,
          worksheet.getCell(pc.responsabilidad).value as number || 0,
          worksheet.getCell(pc.estabilidadEmocional).value as number || 0,
          worksheet.getCell(pc.sociabilizacion).value as number || 0,
          worksheet.getCell(pc.autoestima).value as number || 0,
          worksheet.getCell(pc.cautela).value as number || 0,
          worksheet.getCell(pc.originalidad).value as number || 0,
          worksheet.getCell(pc.relacionesInterpersonales).value as number || 0,
          worksheet.getCell(pc.vigor).value as number || 0,
        ],
      },
    };
  }

  static async procesarTest(respuestas: RespuestaUsuario[]): Promise<ResultadoExcel> {
    const rutaTrabajo = await this.crearCopiaTrabajo();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(rutaTrabajo);
    
    await this.limpiarRespuestas(workbook);
    await this.escribirRespuestas(workbook, respuestas);
    await workbook.xlsx.writeFile(rutaTrabajo);
    
    return await this.leerResultados(workbook);
  }
}