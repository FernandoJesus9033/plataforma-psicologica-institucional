import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 });
  }

  const store = getStore("usuarios");
  const userData = await store.get(session.user.email);
  
  if (!userData) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const user = JSON.parse(userData);
  const isValid = await bcrypt.compare(currentPassword, user.password);
  
  if (!isValid) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  
  await store.setJSON(session.user.email, user);

  return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente" });
}