import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'

export default function InscreverJogador() {
  const router = useRouter()
  const { id } = router.query
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`/api/match/${id}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      router.push(`/match/${id}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Erro ao cadastrar jogador')
    }
    setLoading(false)
  }

  return (
    <main className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
      <Link
        href={`/match/${id}`}
        className="text-gray-500 text-sm hover:underline mb-4 inline-block"
      >
        &lt; Voltar para partida
      </Link>
      <h1 className="text-2xl font-bold mb-4">Adicionar na partida</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome do jogador
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded-md p-2"
            placeholder="Seu nome"
          />
        </div>
        {error && <p className="text-green-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Inscrever'}
        </button>
      </form>
    </main>
  )
}
