import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/prisma'

type MatcheRequestBody = {
  date: string // DateTime
  location: string // String
  maxPlayers?: number // Int, opcional
}
// # matches?cursor=2025-05-27T18:00:00.000Z
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { date, location }: MatcheRequestBody = req.body
    if (!date || !location) {
      return res
        .status(400)
        .json({ error: 'Data e local da pelada é obrigatório' })
    }

    const match = await prisma.match.create({
      data: {
        date: new Date(date),
        location,
      },
    })

    return res.status(201).json(match)
  }

  if (req.method === 'GET') {
    const { cursor } = req.query
    const matches = await prisma.match.findMany({
      take: 10,
      orderBy: {
        date: 'desc',
      },
      ...(cursor && {
        cursor: {
          id: cursor as string,
        },
        skip: 1, // Skip the cursor match
      }),
    })
    return res.status(200).json(matches)
  }
  // Método não permitido
  res.setHeader('Allow', ['POST', 'GET'])
  return res.status(405).end('Método não permitido')
}
