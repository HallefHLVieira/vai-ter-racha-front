import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await signIn('credentials', {
      phone,
      password,
      redirect: false,
      callbackUrl: '/',
    })

    if (res?.error) setError('Telefone ou senha inválidos')
    else window.location.href = '/'
  }

  return (
    <main className="max-w-xs mx-auto mt-20 bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        >
          Entrar
        </button>
        <Link
          href="/signup"
          className="text-sm text-blue-600 hover:underline text-center"
        >
          Não tem conta? Cadastre-se
        </Link>
      </form>
    </main>
  )
}
