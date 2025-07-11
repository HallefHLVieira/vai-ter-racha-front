import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../../prisma/prisma'
import { requireAuth } from '@/helpers/requireAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await requireAuth(req, res)
  if (!session) return

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID da partida inválido' })
  }

  if (req.method === 'POST') {
    const { name } = req.body
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Nome do jogador é obrigatório' })
    }

    try {
      const player = await prisma.player.create({
        data: {
          userId: req.body.userId,
          matchId: id,
        },
      })
      return res.status(201).json(player)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao cadastrar jogador' })
    }
  }

  if (req.method === 'GET') {
    try {
      const players = await prisma.player.findMany({
        where: { matchId: id },
      })
      return res.status(200).json(players)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao buscar jogadores' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end('Método não permitido')
}
