import { NextResponse } from "next/server";

// VERSIÓN SIMPLE - Sin dependencias problemáticas (bcrypt, blobs, etc.)
export async function GET() {
  try {
    console.log("🚀 API /api/alumnos SIMPLE fue llamada");
    
    // Datos de prueba - Después de que funcione, conectamos con los blobs
    const alumnosPrueba = [
      { 
        id: "1", 
        name: "Fernando Jesus Colli Cach", 
        email: "elcachcolli@gmail.com", 
        createdAt: new Date().toISOString() 
      },
      { 
        id: "2", 
        name: "Francisco Emiliano Colli Cach", 
        email: "francisco@gmail.com", 
        createdAt: new Date().toISOString() 
      }
    ];
    
    return NextResponse.json(alumnosPrueba);
    
  } catch (error) {
    console.error("❌ Error en API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: String(error) }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("🚀 POST /api/alumnos SIMPLE");
    
    const body = await req.json();
    const { name, email } = body;
    
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y correo son requeridos" }, 
        { status: 400 }
      );
    }
    
    // Simular creación
    const nuevoAlumno = {
      id: crypto.randomUUID(),
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      success: true, 
      ...nuevoAlumno 
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Error al crear alumno" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    console.log("🚀 DELETE /api/alumnos SIMPLE");
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Error al eliminar" }, 
      { status: 500 }
    );
  }
}