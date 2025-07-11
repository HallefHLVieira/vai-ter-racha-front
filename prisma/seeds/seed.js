// filepath: prisma/seeds/seed.js
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const passAdmin = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
    data: {
      name: 'Administrador',
      phone: '11999990000',
      password: passAdmin,
      role: 'ADMIN',
    },
  })
}

main()
  .then(() => {
    console.log('Seed concluído!')
    return prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    return prisma.$disconnect()
  })
