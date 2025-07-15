import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/helpers/requireAuth'
import { prisma } from '../../../../../prisma/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await requireAuth(req, res)
  if (!session) return

  if (session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do jogador inválido' })
  }

  if (req.method === 'PUT') {
    try {
      const player = await prisma.player.update({
        where: { id },
        data: req.body,
      })
      return res.status(200).json(player)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao atualizar jogador' })
    }
  }

  res.setHeader('Allow', ['PUT'])
  return res.status(405).end('Método não permitido')
}
