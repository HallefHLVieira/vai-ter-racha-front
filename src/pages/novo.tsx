import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Novo() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    // Junta data e hora em um ISO string
    const dateTime = date && time ? new Date(`${date}T${time}`) : null;

    if (!dateTime || !location || !maxPlayers) {
      alert('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (maxPlayers < 2 || maxPlayers > 50) {
      alert('Número máximo de jogadores deve ser entre 2 e 50');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dateTime.toISOString(),
        location,
        maxPlayers,
      }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const errorData = await res.json();
      alert(errorData.error || 'Erro ao criar a partida');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
        <Link href="/" className="text-gray-500 text-sm hover:underline mb-4 inline-block">
          &lt; Voltar para partidas
        </Link>
        <h1 className="text-2xl font-bold mb-1">Criar Nova Pelada</h1>
        <p className="text-gray-500 mb-6">Preencha os dados abaixo para criar uma nova partida</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">Data da Partida</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              placeholder="dd/mm/aaaa"
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">Horário</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              placeholder="--:--"
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">Local da Partida</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              placeholder="Ex: Quadra do Parque Central"
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="maxPlayers" className="block text-sm font-medium mb-1">Número Máximo de Jogadores</label>
            <input
              type="number"
              id="maxPlayers"
              value={maxPlayers}
              onChange={e => setMaxPlayers(Number(e.target.value))}
              min={2}
              max={50}
              required
              className="block w-full border border-gray-300 rounded-md p-2"
            />
            <span className="text-xs text-gray-500">Mínimo: 2 jogadores | Máximo: 50 jogadores</span>
          </div>
          <div className="flex gap-4 mt-6">
            <Link
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md text-center hover:bg-gray-200"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              {loading ? 'Criando...' : 'Criar Partida'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}