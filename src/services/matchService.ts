import { prisma } from '../../prisma/prisma'

export async function getMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      players: true,
    },
  })
}
