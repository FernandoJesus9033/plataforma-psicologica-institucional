import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/api/configuracion", process.env.NEXTAUTH_URL));
}

export async function PUT(req: Request) {
  return NextResponse.redirect(new URL("/api/configuracion", process.env.NEXTAUTH_URL));
}