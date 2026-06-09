import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = "psicologa@test.com"
  const password = "123456"
  const name = "Psicóloga"
  const role = "PSYCHOLOGIST"

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log(`✅ El usuario ${email} ya existe`)
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

  console.log(`✅ Usuario creado: ${user.email} (${user.role})`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })