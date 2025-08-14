import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Match } from '@prisma/client'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { prisma } from '../../../../prisma/prisma'
import { useState } from 'react'
import router from 'next/router'
import { useSession } from 'next-auth/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (context: any) => {
  const { params } = context
  const { id } = params

  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  try {
    // Busque direto no banco!
    const matchData = await prisma.match.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            user: true, // Inclui o usuário relacionado ao player
          },
        },
      },
    })

    if (!matchData) {
      return { notFound: true }
    }

    return {
      props: {
        match: {
          ...matchData,
          date: matchData.date.toISOString(),
          createdAt: matchData.createdAt.toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          players: matchData.players.map((p: any) => ({
            ...p,
            name: p.user ? p.user.name : '',
          })),
        },
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
  const [showInvite, setShowInvite] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const { data: session } = useSession()

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
            Cadastrar
          </Link>
          <button
            className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition font-bold"
            onClick={() => setShowInvite(true)}
          >
            Levar alguém
          </button>
        </div>

        {showInvite && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4">Jogador convidado</h2>
              <input
                type="text"
                placeholder="Nome do convidado"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="border rounded w-full p-2 mb-4"
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => setShowInvite(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-yellow-600 text-white px-3 py-1 rounded"
                  onClick={async () => {
                    await fetch(`/api/match/${match.id}/players`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: inviteName,
                        invitedById: session?.user?.id,
                      }),
                    })
                    setShowInvite(false)
                    setInviteName('')
                    router.replace(`/match/${match.id}`)
                  }}
                >
                  Convidar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-y-auto max-h-[60vh]">
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 border-b text-left text-gray-700">
                  Nome
                </th>
                <th className="px-4 py-2 border-b text-center text-gray-700">
                  Pg
                </th>
                <th className="px-4 py-2 border-b text-center text-gray-700">
                  Presente
                </th>
              </tr>
            </thead>
            <tbody>
              {match.players && match.players.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                match.players.map((player: any, idx: number) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{idx + 1}</td>
                    <td className="px-4 py-2 border-b">
                      {player.name || player.invitePlayerName}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <input
                        type="checkbox"
                        checked={!!player.confirmed}
                        onChange={async (e) => {
                          const confirmed = e.target.checked
                          await fetch(`/api/player/${player.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ confirmed }),
                          })
                        }}
                        className="w-5 h-5 accent-green-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <input
                        type="checkbox"
                        checked={!!player.checkedIn}
                        onChange={async (e) => {
                          const checkedIn = e.target.checked
                          await fetch(`/api/player/${player.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ checkedIn }),
                          })
                        }}
                        className="w-5 h-5 accent-yellow-600 cursor-pointer"
                      />
                    </td>
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
