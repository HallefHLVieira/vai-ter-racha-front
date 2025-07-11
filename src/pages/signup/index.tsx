import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Cadastrar() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/login')
    } else {
      setError(data.error || 'Erro ao cadastrar')
    }
    setLoading(false)
  }

  return (
    <main className="max-w-xs mx-auto mt-20 bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">Cadastrar</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2"
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-green-600 text-white rounded p-2 font-bold"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <Link
          href="/login"
          className="text-sm text-blue-600 hover:underline text-center"
        >
          Já tem conta? Entrar
        </Link>
      </form>
    </main>
  )
}
