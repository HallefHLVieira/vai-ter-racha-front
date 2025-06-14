import { Match } from '@prisma/client'
import { useEffect } from 'react'

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

export default function MatchPage({ match }: { match: Match }) {
  // const router = useRouter()
  // const [players, setPlayers] = useState([])

  return (
    <div>
      <h1>Partida: {match.location}</h1>
      <p>Data: {new Date(match.date).toLocaleDateString()}</p>
      <h2>Jogadores</h2>
    </div>
  )
}
