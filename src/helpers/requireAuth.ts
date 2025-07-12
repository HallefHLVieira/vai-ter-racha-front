import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requireAuth(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({ error: 'Não autorizado' })
    return null
  }
  return session
}
