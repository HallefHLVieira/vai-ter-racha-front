import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/prisma'

type MatcheRequestBody = {
  date: string // DateTime
  location: string // String
}
// # matches?cursor=2025-05-27T18:00:00.000Z
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Método não permitido')
  }

  const { date, location }:MatcheRequestBody = req.body


  if (!date || !location) {
    return res.status(400).json({ error: 'Data e local da pelada é obrigatório' })
  }

  // salva o jogo
  const match = await prisma.match.create({
    data: {
      date: new Date(date),
      location,
    },
  })

  return res.status(201).json(match)
}

