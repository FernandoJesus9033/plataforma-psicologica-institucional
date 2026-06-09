// Mapa para almacenar intentos por IP
const ipMap = new Map<string, { count: number; timestamp: number }>();

// Limpiar mapa cada hora para liberar memoria
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipMap.entries()) {
    if (now - data.timestamp > 60 * 60 * 1000) {
      ipMap.delete(ip);
    }
  }
}, 60 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Verifica si una IP ha excedido el límite de peticiones
 * @param ip - Dirección IP del cliente
 * @param limit - Número máximo de peticiones permitidas
 * @param windowMs - Ventana de tiempo en milisegundos
 * @returns Objeto con el resultado
 */
export function rateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const record = ipMap.get(ip);
  const resetTime = record ? record.timestamp + windowMs : now + windowMs;

  if (!record) {
    ipMap.set(ip, { count: 1, timestamp: now });
    return { success: true, remaining: limit - 1, resetTime };
  }

  if (now - record.timestamp > windowMs) {
    ipMap.set(ip, { count: 1, timestamp: now });
    return { success: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.timestamp + windowMs };
  }

  record.count++;
  ipMap.set(ip, record);
  return { success: true, remaining: limit - record.count, resetTime };
}