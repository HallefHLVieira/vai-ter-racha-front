import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end('Método não permitido')

  const { name, phone, password } = req.body
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' })
  }

  try {
    const exists = await prisma.user.findUnique({ where: { phone } })
    if (exists) return res.status(400).json({ error: 'Telefone já cadastrado' })

    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: { name, phone, password: hashed, role: 'JOGADOR' },
    })
    return res.status(201).json({ ok: true })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return res.status(500).json({ error: 'Erro ao cadastrar usuário' })
  }
}
