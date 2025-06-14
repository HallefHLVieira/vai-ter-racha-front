import { GetServerSideProps } from 'next'
import { useState } from 'react'
import { prisma } from '../../prisma/prisma'
import MatchCard from '@/components/MatchCard'

type Match = { id: string; date: string; location: string }
type HomeProps = { initial: Match[]; nextCursor: string | null }

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const matches = await prisma.match.findMany({
    orderBy: { date: 'desc' },
    take: 11,
  })

  const nextCursor =
    matches.length === 11 ? matches[10].date.toISOString() : null

  return {
    props: {
      initial: matches.slice(0, 10).map((m) => ({
        id: m.id,
        date: m.date.toISOString(),
        location: m.location,
      })),
      nextCursor,
    },
  }
}

export default function Home({ initial, nextCursor: cursor }: HomeProps) {
  const [matches, setMatches] = useState(initial)
  const [nextCursor, setNextCursor] = useState<string | null>(cursor)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    if (!nextCursor) return
    setLoading(true)
    const res = await fetch(`/api/matches?cursor=${nextCursor}`)
    const data: { matches: Match[]; nextCursor: string | null } =
      await res.json()
    setMatches((prev) => [...prev, ...data.matches])
    setNextCursor(data.nextCursor)
    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4 bg-slate-900/60 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Partidas</h1>
        <a
          href="/novo"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Novo Racha
        </a>
      </header>

      {matches.map((m) => (
        <MatchCard key={m.id} id={m.id} date={m.date} location={m.location} />
      ))}

      {nextCursor && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md"
        >
          {loading ? 'Carregando...' : 'Carregar partidas mais antigas'}
        </button>
      )}

      {!nextCursor && (
        <p className="text-center text-sm text-gray-300">
          Nenhuma partida mais antiga.
        </p>
      )}
    </main>
  )
}
