export const EXCEL_CONFIG = {
  sheets: {
    APLICACION_Y_CONTEO: "APLICACION Y CONTEO",
    CALIFICACION: "CALIFICACION"
  },
  inputs: {
    parte4_mas: {
      28: ["H7", "I8", "I9", "I10"],
      29: ["K7", "L8", "K9", "K10"],
      30: ["I11", "H12", "I13", "I14"],
      31: ["L11", "L12", "L13", "K14"],
      32: ["I15", "H16", "H17", "H18"],
      33: ["L15", "K16", "L17", "L18"],
      34: ["I19", "I20", "I21", "H22"],
      35: ["K19", "L20", "L21", "K22"],
      36: ["H23", "I24", "H25", "H26"],
      37: ["K23", "L24", "L25", "L26"]
    },
    parte4_menos: {
      28: ["H7", "I8", "I9", "I10"],
      29: ["K7", "L8", "K9", "K10"]
    },
    parte3_mas: {
      18: ["H27", "I28", "I29", "I30"],
      19: ["L27", "L28", "L29", "K30"],
      20: ["H31", "H32", "H33", "I34"],
      21: ["K31", "K32", "L33", "K34"],
      22: ["I35", "I136", "I37", "H38"],
      23: ["K35", "L36", "L37", "L38"],
      24: ["H39", "H40", "I41", "H42"],
      25: ["L39", "K40", "L41", "L42"]
    }
  },
  outputs: {
    ppg: {
      ascendencia: { sheet: "APLICACION Y CONTEO", cell: "O12", row: 11, col: 14 },
      responsabilidad: { sheet: "APLICACION Y CONTEO", cell: "P12", row: 11, col: 15 },
      estabilidad_emocional: { sheet: "APLICACION Y CONTEO", cell: "Q12", row: 11, col: 16 },
      sociabilizacion: { sheet: "APLICACION Y CONTEO", cell: "R12", row: 11, col: 17 }
    },
    ipg: {
      autoestima: { sheet: "APLICACION Y CONTEO", cell: "S12", row: 11, col: 18 },
      cautela: { sheet: "APLICACION Y CONTEO", cell: "T12", row: 11, col: 19 },
      originalidad: { sheet: "APLICACION Y CONTEO", cell: "U12", row: 11, col: 20 },
      relaciones_interpersonales: { sheet: "APLICACION Y CONTEO", cell: "V12", row: 11, col: 21 },
      vigor: { sheet: "APLICACION Y CONTEO", cell: "W12", row: 11, col: 22 }
    },
    percentiles: {
      ppg: {
        ascendencia: { sheet: "APLICACION Y CONTEO", cell: "O13", row: 12, col: 14 },
        responsabilidad: { sheet: "APLICACION Y CONTEO", cell: "P13", row: 12, col: 15 },
        estabilidad_emocional: { sheet: "APLICACION Y CONTEO", cell: "Q13", row: 12, col: 16 },
        sociabilizacion: { sheet: "APLICACION Y CONTEO", cell: "R13", row: 12, col: 17 }
      },
      ipg: {
        autoestima: { sheet: "APLICACION Y CONTEO", cell: "S13", row: 12, col: 18 },
        cautela: { sheet: "APLICACION Y CONTEO", cell: "T13", row: 12, col: 19 },
        originalidad: { sheet: "APLICACION Y CONTEO", cell: "U13", row: 12, col: 20 },
        relaciones_interpersonales: { sheet: "APLICACION Y CONTEO", cell: "V13", row: 12, col: 21 },
        vigor: { sheet: "APLICACION Y CONTEO", cell: "W13", row: 12, col: 22 }
      }
    }
  }
};

export function celdaToRowCol(celda: string): { row: number; col: number } {
  const match = celda.match(/([A-Z]+)(\d+)/);
  if (!match) throw new Error(`Celda inválida: ${celda}`);
  
  const colStr = match[1];
  const row = parseInt(match[2]) - 1;
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return { row, col: col - 1 };
}