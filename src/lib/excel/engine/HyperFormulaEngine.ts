import { HyperFormula, RawCellContent } from 'hyperformula';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs/promises';
import { ResultadoExcel, RespuestaUsuario } from './types';
import { EXCEL_CONFIG, celdaToRowCol } from '../config/excelConfig';

class HyperFormulaEngine {
  private engine: HyperFormula | null = null;
  private excelPath: string;
  private copiaActual: string | null = null;

  constructor() {
    this.excelPath = path.join(process.cwd(), 'public', 'data', 'Test Gordon P-IPG (automatizado) juan manuel.xlsx');
  }

  public static async crearNueva(): Promise<HyperFormulaEngine> {
    const instance = new HyperFormulaEngine();
    await instance.init();
    return instance;
  }

  private async crearCopiaTrabajo(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const copiaPath = path.join(process.cwd(), 'public', 'data', 'temp', `test-${timestamp}-${random}.xlsx`);
    const dir = path.dirname(copiaPath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.copyFile(this.excelPath, copiaPath);
    this.copiaActual = copiaPath;
    
    console.log(`📁 Nueva copia creada: ${copiaPath}`);
    return copiaPath;
  }

  public async init(): Promise<void> {
    console.log("🚀 Inicializando HyperFormula...");
    
    const copiaPath = await this.crearCopiaTrabajo();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(copiaPath);
    
    const sheetsData: Record<string, RawCellContent[][]> = {};
    
    workbook.eachSheet((worksheet) => {
      const sheetName = worksheet.name;
      const rowCount = worksheet.rowCount;
      const colCount = worksheet.columnCount;
      
      const sheetMatrix: RawCellContent[][] = [];
      
      for (let row = 1; row <= rowCount; row++) {
        const rowCells: RawCellContent[] = [];
        for (let col = 1; col <= colCount; col++) {
          const cell = worksheet.getCell(row, col);
          let value: RawCellContent = null;
          
          if (cell.formula) {
            value = `=${cell.formula}`;
          } else if (cell.value !== null && cell.value !== undefined) {
            const cellValue = cell.value;
            if (typeof cellValue === 'number') {
              value = cellValue;
            } else if (typeof cellValue === 'string') {
              value = cellValue;
            } else if (cellValue && typeof cellValue === 'object' && 'result' in cellValue) {
              value = (cellValue as any).result;
            } else {
              value = cellValue?.toString() || null;
            }
          }
          rowCells.push(value);
        }
        sheetMatrix.push(rowCells);
      }
      sheetsData[sheetName] = sheetMatrix;
    });
    
    this.engine = HyperFormula.buildFromSheets(sheetsData, {
      licenseKey: 'gpl-v3',
      useColumnIndex: true,
    });
    
    console.log("✅ HyperFormula inicializado");
  }

  private async limpiarRespuestas(): Promise<void> {
    if (!this.engine) throw new Error("Engine no inicializado");
    
    const rangos = ["B7:B46", "C7:C46", "E7:E46", "F7:F46", "H7:H46", "I7:I46", "K7:K46", "L7:L46"];
    
    for (const rango of rangos) {
      const [start, end] = rango.split(':');
      const startCell = celdaToRowCol(start);
      const endCell = celdaToRowCol(end);
      
      for (let row = startCell.row; row <= endCell.row; row++) {
        for (let col = startCell.col; col <= endCell.col; col++) {
          const currentValue = this.engine.getCellValue({ sheet: 0, row, col });
          if (currentValue === 1 || currentValue === "1") {
            this.engine.setCellContents({ sheet: 0, row, col }, null);
          }
        }
      }
    }
  }

  private getCeldaParaRespuesta(respuesta: RespuestaUsuario): { row: number; col: number } | null {
    const { groupId, afirmacionIndex, esMasParecido } = respuesta;
    
    let celda: string | undefined;
    
    if (groupId >= 28 && groupId <= 37) {
      const grupos = esMasParecido ? EXCEL_CONFIG.inputs.parte4_mas : EXCEL_CONFIG.inputs.parte4_menos;
      const celdas = grupos[groupId as keyof typeof grupos];
      if (celdas && celdas[afirmacionIndex]) {
        celda = celdas[afirmacionIndex];
      }
    }
    
    if (groupId >= 18 && groupId <= 25 && esMasParecido) {
      const grupos = EXCEL_CONFIG.inputs.parte3_mas;
      const celdas = grupos[groupId as keyof typeof grupos];
      if (celdas && celdas[afirmacionIndex]) {
        celda = celdas[afirmacionIndex];
      }
    }
    
    return celda ? celdaToRowCol(celda) : null;
  }

  public async escribirRespuestas(respuestas: RespuestaUsuario[]): Promise<void> {
    if (!this.engine) throw new Error("Engine no inicializado");
    
    await this.limpiarRespuestas();
    
    for (const respuesta of respuestas) {
      const celda = this.getCeldaParaRespuesta(respuesta);
      if (celda) {
        this.engine.setCellContents({ sheet: 0, row: celda.row, col: celda.col }, 1);
      }
    }
    
    // NOTA: HyperFormula recalcula automáticamente, no necesita recalculate()
  }

  public async leerResultados(): Promise<ResultadoExcel> {
    if (!this.engine) throw new Error("Engine no inicializado");
    
    // Leer celdas de resultados
    // PD (Puntajes Directos) - Fila 12 (índice 11)
    const pdAscendencia = this.engine.getCellValue({ sheet: 0, row: 11, col: 14 }) as number || 0;   // O12
    const pdResponsabilidad = this.engine.getCellValue({ sheet: 0, row: 11, col: 15 }) as number || 0; // P12
    const pdEstabilidad = this.engine.getCellValue({ sheet: 0, row: 11, col: 16 }) as number || 0;     // Q12
    const pdSociabilidad = this.engine.getCellValue({ sheet: 0, row: 11, col: 17 }) as number || 0;    // R12
    const pdAutoestima = this.engine.getCellValue({ sheet: 0, row: 11, col: 18 }) as number || 0;      // S12
    const pdCautela = this.engine.getCellValue({ sheet: 0, row: 11, col: 19 }) as number || 0;         // T12
    const pdOriginalidad = this.engine.getCellValue({ sheet: 0, row: 11, col: 20 }) as number || 0;    // U12
    const pdRelaciones = this.engine.getCellValue({ sheet: 0, row: 11, col: 21 }) as number || 0;      // V12
    const pdVigor = this.engine.getCellValue({ sheet: 0, row: 11, col: 22 }) as number || 0;           // W12
    
    // PC (Percentiles) - Fila 13 (índice 12)
    const pcAscendencia = this.engine.getCellValue({ sheet: 0, row: 12, col: 14 }) as number || 0;
    const pcResponsabilidad = this.engine.getCellValue({ sheet: 0, row: 12, col: 15 }) as number || 0;
    const pcEstabilidad = this.engine.getCellValue({ sheet: 0, row: 12, col: 16 }) as number || 0;
    const pcSociabilidad = this.engine.getCellValue({ sheet: 0, row: 12, col: 17 }) as number || 0;
    const pcAutoestima = this.engine.getCellValue({ sheet: 0, row: 12, col: 18 }) as number || 0;
    const pcCautela = this.engine.getCellValue({ sheet: 0, row: 12, col: 19 }) as number || 0;
    const pcOriginalidad = this.engine.getCellValue({ sheet: 0, row: 12, col: 20 }) as number || 0;
    const pcRelaciones = this.engine.getCellValue({ sheet: 0, row: 12, col: 21 }) as number || 0;
    const pcVigor = this.engine.getCellValue({ sheet: 0, row: 12, col: 22 }) as number || 0;
    
    // Nombre y fecha
    const nombre = this.engine.getCellValue({ sheet: 0, row: 1, col: 0 }) as string || "Estudiante"; // A2
    const fecha = this.engine.getCellValue({ sheet: 0, row: 2, col: 0 }) as string || new Date().toLocaleDateString(); // A3
    
    // Eliminar copia temporal
    if (this.copiaActual) {
      try {
        await fs.unlink(this.copiaActual);
        console.log("🗑️ Copia temporal eliminada");
      } catch (e) {}
    }
    
    return {
      nombre,
      fecha,
      ppg: {
        ascendencia: pdAscendencia,
        responsabilidad: pdResponsabilidad,
        estabilidad_emocional: pdEstabilidad,
        sociabilizacion: pdSociabilidad,
      },
      ipg: {
        autoestima: pdAutoestima,
        cautela: pdCautela,
        originalidad: pdOriginalidad,
        relaciones_interpersonales: pdRelaciones,
        vigor: pdVigor,
      },
      percentiles: {
        pd: [pdAscendencia, pdResponsabilidad, pdEstabilidad, pdSociabilidad, pdAutoestima, pdCautela, pdOriginalidad, pdRelaciones, pdVigor],
        pc: [pcAscendencia, pcResponsabilidad, pcEstabilidad, pcSociabilidad, pcAutoestima, pcCautela, pcOriginalidad, pcRelaciones, pcVigor],
      },
    };
  }

  public async procesarTest(respuestas: RespuestaUsuario[]): Promise<ResultadoExcel> {
    await this.escribirRespuestas(respuestas);
    return await this.leerResultados();
  }
}

export default HyperFormulaEngine;