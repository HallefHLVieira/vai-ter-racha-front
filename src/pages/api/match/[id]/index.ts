import { getMatchById } from '@/services/matchService'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID da partida inválido' })
  }

  if (req.method === 'GET') {
    try {
      const match = await getMatchById(id as string)

      if (!match)
        return res.status(404).json({ error: 'Partida não encontrada' })

      return res.status(200).json(match)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao buscar partida' })
    }
  }

  // Método não permitido
  res.setHeader('Allow', ['GET'])
  return res.status(405).end('Método não permitido')
}
