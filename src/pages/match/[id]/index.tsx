import { Match } from '@prisma/client'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (context: any) => {
  const { params } = context
  const { id } = params

  try {
    const response = await fetch(`http://localhost:3000/api/match/${id}`)
    if (!response.ok) {
      throw new Error('Erro ao buscar dados da partida')
    }

    const matchData = await response.json()

    return {
      props: {
        match: matchData,
      },
    }
  } catch (error) {
    console.error('Erro ao buscar dados da partida:', error)
    return {
      notFound: true,
    }
  }
}

type Player = {
  id: string
  name: string
}

type MatchWithPlayers = Match & {
  players: Player[]
}

export default function MatchPage({ match }: { match: MatchWithPlayers }) {
  return (
    <main className="max-w-md mx-auto bg-white rounded-lg shadow p-4">
      <Link
        href="/"
        className="text-gray-500 text-sm hover:underline mb-4 inline-block"
      >
        &lt; Voltar para partidas
      </Link>
      <div className="font-semibold flex max-w bg-gray-900 rounded-lg shadow-lg p-4 mb-6 text-white text-inline justify-between items-center">
        <h1>{match.location}</h1>
        <div className="h-5 p-1 flex bg-yellow-600 items-center justify-center rounded text-sm">
          <span>
            {new Date(match.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold mb-2">Jogadores</h2>
          <Link
            href={`/match/${match.id}/inscrever`}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition font-bold"
          >
            +
          </Link>
        </div>
        <div>
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 border-b text-left text-gray-700">
                  Nome
                </th>
              </tr>
            </thead>
            <tbody>
              {match.players && match.players.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                match.players.map((player: any, idx: number) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{idx + 1}</td>
                    <td className="px-4 py-2 border-b">{player.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-2 text-gray-500 text-center"
                  >
                    Nenhum jogador cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
