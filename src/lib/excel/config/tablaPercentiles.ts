// ============================================
// TABLA DE PERCENTILES (Cuadro 2-2)
// Basada en la imagen del 8/6/2026
// ============================================

export interface PercentilPorEscala {
  A: number;
  R: number;
  E: number;
  S: number;
  C: number;
  O: number;
  P: number;
  V: number;
}

export const tablaPercentiles: Record<number, PercentilPorEscala> = {
  37: { A: 0, R: 0, E: 0, S: 0, C: 0, O: 0, P: 0, V: 99 },
  36: { A: 0, R: 99, E: 0, S: 0, C: 99, O: 99, P: 99, V: 98 },
  35: { A: 0, R: 98, E: 0, S: 0, C: 98, O: 98, P: 98, V: 97 },
  34: { A: 0, R: 96, E: 99, S: 0, C: 97, O: 96, P: 97, V: 95 },
  33: { A: 0, R: 93, E: 98, S: 0, C: 95, O: 94, P: 95, V: 92 },
  32: { A: 99, R: 89, E: 96, S: 99, C: 93, O: 91, P: 92, V: 88 },
  31: { A: 98, R: 84, E: 93, S: 98, C: 90, O: 88, P: 88, V: 83 },
  30: { A: 96, R: 78, E: 89, S: 96, C: 86, O: 84, P: 84, V: 78 },
  29: { A: 93, R: 71, E: 84, S: 93, C: 82, O: 79, P: 79, V: 73 },
  28: { A: 89, R: 64, E: 78, S: 90, C: 77, O: 74, P: 74, V: 68 },
  27: { A: 84, R: 57, E: 72, S: 86, C: 72, O: 68, P: 69, V: 62 },
  26: { A: 79, R: 50, E: 65, S: 81, C: 66, O: 62, P: 64, V: 56 },
  25: { A: 73, R: 43, E: 58, S: 76, C: 60, O: 56, P: 58, V: 50 },
  24: { A: 67, R: 36, E: 51, S: 70, C: 54, O: 49, P: 52, V: 44 },
  23: { A: 61, R: 30, E: 45, S: 64, C: 48, O: 42, P: 46, V: 38 },
  22: { A: 54, R: 25, E: 39, S: 58, C: 42, O: 36, P: 40, V: 32 },
  21: { A: 47, R: 20, E: 33, S: 51, C: 36, O: 30, P: 35, V: 27 },
  20: { A: 41, R: 16, E: 27, S: 45, C: 30, O: 24, P: 30, V: 22 },
  19: { A: 35, R: 12, E: 22, S: 39, C: 24, O: 19, P: 25, V: 18 },
  18: { A: 29, R: 9, E: 18, S: 33, C: 19, O: 14, P: 20, V: 14 },
  17: { A: 23, R: 7, E: 14, S: 28, C: 15, O: 10, P: 16, V: 10 },
  16: { A: 18, R: 5, E: 11, S: 23, C: 11, O: 7, P: 12, V: 7 },
  15: { A: 14, R: 4, E: 8, S: 18, C: 8, O: 5, P: 9, V: 5 },
  14: { A: 11, R: 3, E: 6, S: 14, C: 5, O: 3, P: 7, V: 3 },
  13: { A: 8, R: 2, E: 5, S: 10, C: 3, O: 2, P: 5, V: 2 },
  12: { A: 5, R: 1, E: 4, S: 7, C: 2, O: 1, P: 4, V: 1 },
  11: { A: 3, R: 0, E: 3, S: 5, C: 1, O: 0, P: 3, V: 0 },
  10: { A: 2, R: 0, E: 2, S: 3, C: 0, O: 0, P: 2, V: 0 },
  9:  { A: 1, R: 0, E: 1, S: 2, C: 0, O: 0, P: 1, V: 0 },
  8:  { A: 0, R: 0, E: 0, S: 1, C: 0, O: 0, P: 0, V: 0 },
};

export function obtenerPercentil(escala: string, puntaje: number): number {
  if (puntaje < 8) return 0;
  let puntajeBuscar = Math.min(puntaje, 37);
  
  if (tablaPercentiles[puntajeBuscar]) {
    const valores = tablaPercentiles[puntajeBuscar];
    switch (escala) {
      case "A": return valores.A;
      case "R": return valores.R;
      case "E": return valores.E;
      case "S": return valores.S;
      case "C": return valores.C;
      case "O": return valores.O;
      case "P": return valores.P;
      case "V": return valores.V;
      default: return 50;
    }
  }
  return 0;
}

export function getInterpretacion(percentil: number): { texto: string; color: string } {
  if (percentil <= 10) return { texto: "Muy Bajo", color: "#ef4444" };
  if (percentil <= 30) return { texto: "Bajo", color: "#f97316" };
  if (percentil <= 70) return { texto: "Promedio", color: "#f59e0b" };
  if (percentil <= 90) return { texto: "Alto", color: "#8b5cf6" };
  return { texto: "Muy Alto", color: "#10b981" };
}