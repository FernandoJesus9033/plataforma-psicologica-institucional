import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST() {
  const session = await getServerSession();
  
  // Crear respuesta
  const response = NextResponse.json({ success: true });
  
  // Limpiar cookies de sesión
  response.cookies.delete("__Secure-next-auth.session-token");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");
  response.cookies.delete("__Secure-next-auth.csrf-token");
  
  // Headers de seguridad adicionales
  response.headers.set("Clear-Site-Data", "\"cookies\"");
  
  return response;
}