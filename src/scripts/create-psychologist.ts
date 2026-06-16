import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.PSYCHOLOGIST_EMAIL || "psicologo@ejemplo.com"
  
  // ✅ Generar contraseña segura desde variable de entorno o crear una aleatoria
  const password = process.env.PSYCHOLOGIST_PASSWORD || crypto.randomBytes(16).toString('hex')
  
  const name = process.env.PSYCHOLOGIST_NAME || "Psicólogo Principal"
  const role = "PSYCHOLOGIST"

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log("⚠️ El usuario ya existe:", email)
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    }
  })

  console.log("✅ Psicólogo creado exitosamente:", { 
    email: user.email, 
    role: user.role,
    password: process.env.PSYCHOLOGIST_PASSWORD ? "🔒 Usando variable de entorno" : `🔑 Contraseña generada: ${password}`
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())