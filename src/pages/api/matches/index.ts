// pages/api/matches/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const matches = await prisma.match.findMany({
      include: { players: true },
    })
    return res.status(200).json(matches)
  }

  if (req.method === 'POST') {
    const { date, location } = req.body

    const match = await prisma.match.create({
      data: {
        date: new Date(date),
        location,
      },
    })

    return res.status(201).json(match)
  }

  return res.status(405).end()
}
