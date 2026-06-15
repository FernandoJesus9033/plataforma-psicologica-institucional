import { NextResponse } from "next/server";

export async function GET() {
  console.log("🏓 API /api/ping fue llamada");
  
  return NextResponse.json({ 
    message: "pong", 
    timestamp: new Date().toISOString(),
    status: "API funcionando correctamente"
  });
}