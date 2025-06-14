import { prisma } from '../../prisma/prisma'

export async function getMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
  })
}

export async function getMatchPlayers(matchId: string) {
  return prisma.player.findMany({
    where: { matchId },
  })
}
