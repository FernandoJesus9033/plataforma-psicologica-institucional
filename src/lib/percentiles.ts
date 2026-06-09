// Tabla de percentiles según el manual (Cuadro 2-2)
export function getPercentil(puntaje: number): number {
  if (puntaje >= 37) return 99;
  if (puntaje >= 36) return 98;
  if (puntaje >= 35) return 98;
  if (puntaje >= 34) return 98;
  if (puntaje >= 33) return 98;
  if (puntaje >= 32) return 99;
  if (puntaje >= 31) return 98;
  if (puntaje >= 30) return 96;
  if (puntaje >= 29) return 93;
  if (puntaje >= 28) return 89;
  if (puntaje >= 27) return 84;
  if (puntaje >= 26) return 79;
  if (puntaje >= 25) return 73;
  if (puntaje >= 24) return 67;
  if (puntaje >= 23) return 61;
  if (puntaje >= 22) return 54;
  if (puntaje >= 21) return 47;
  if (puntaje >= 20) return 41;
  if (puntaje >= 19) return 35;
  if (puntaje >= 18) return 29;
  if (puntaje >= 17) return 23;
  if (puntaje >= 16) return 18;
  if (puntaje >= 15) return 14;
  if (puntaje >= 14) return 11;
  if (puntaje >= 13) return 8;
  if (puntaje >= 12) return 5;
  if (puntaje >= 11) return 3;
  if (puntaje >= 10) return 2;
  if (puntaje >= 9) return 1;
  if (puntaje >= 8) return 0;
  return 0;
}

export function getInterpretacion(percentil: number): { texto: string; color: string } {
  if (percentil <= 10) return { texto: "Muy Bajo", color: "#ef4444" };
  if (percentil <= 30) return { texto: "Bajo", color: "#f97316" };
  if (percentil <= 70) return { texto: "Promedio", color: "#f59e0b" };
  if (percentil <= 90) return { texto: "Alto", color: "#8b5cf6" };
  return { texto: "Muy Alto", color: "#10b981" };
}