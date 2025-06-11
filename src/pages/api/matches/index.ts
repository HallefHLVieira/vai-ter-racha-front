import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/prisma'

// # matches?cursor=2025-05-27T18:00:00.000Z
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { cursor } = req.query

  const matches = await prisma.match.findMany({
    where: cursor
      ? { date: { lt: new Date(cursor as string) } } // só mais antigas
      : undefined,
    orderBy: { date: 'desc' },
    take: 11, // buscamos 11 para saber se existe “próxima página”
  })

  // se vieram 11, guardamos a 11ª como próximo cursor
  const nextCursor =
    matches.length === 11 ? matches[10].date.toISOString() : null

  return res.status(200).json({
    matches: matches.slice(0, 10), // enviamos só as 10 que serão exibidas
    nextCursor,
  })
}
