import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = "psicologo@ejemplo.com"
  const password = "psicologo123"
  const name = "Psicólogo Principal"
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

  console.log("✅ Psicólogo creado exitosamente:", { email: user.email, role: user.role })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())