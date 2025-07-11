import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '../../../../prisma/prisma'
import NextAuth from 'next-auth'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Telefone',
      credentials: {
        phone: { label: 'Telefone', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { phone: credentials?.phone },
        })
        if (!user) return null
        const isValid = await compare(credentials!.password, user.password)
        if (!isValid) return null
        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' as const },
}

export default NextAuth(authOptions)
