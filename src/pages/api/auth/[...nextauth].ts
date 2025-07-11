import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '../../../../prisma/prisma'
import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
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
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
        token.name = user.name
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.phone = token.phone as string
        session.user.name = token.name as string
        session.user.id = token.id as string
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
