/**
 * Calcula el estado del semáforo psicológico basado en el puntaje
 * @param score Puntaje de la evaluación (0-100)
 * @returns "GREEN", "YELLOW" o "RED"
 */
export function calculateStatus(score: number): string {
  if (score >= 80) {
    return "GREEN";
  }
  if (score >= 50) {
    return "YELLOW";
  }
  return "RED";
}

/**
 * Obtiene el color hexadecimal para cada estado
 * @param status "GREEN", "YELLOW" o "RED"
 * @returns Código de color hexadecimal
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "GREEN":
      return "#10b981";
    case "YELLOW":
      return "#f59e0b";
    case "RED":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

/**
 * Obtiene el texto descriptivo para cada estado
 * @param status "GREEN", "YELLOW" o "RED"
 * @returns Descripción del estado
 */
export function getStatusDescription(status: string): string {
  switch (status) {
    case "GREEN":
      return "Estable";
    case "YELLOW":
      return "En observación";
    case "RED":
      return "Requiere atención";
    default:
      return "Sin evaluar";
  }
}