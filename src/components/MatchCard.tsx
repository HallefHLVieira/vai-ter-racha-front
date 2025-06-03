type MatchCardProps = {
  date: string
  location: string
}

export default function MatchCard({ date, location }: MatchCardProps) {
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date))

  return (
    <div className="rounded-xl border p-4 shadow-sm flex justify-between items-center bg-slate-50/10 hover:bg-slate-50/30 transition-colors">
      <div>
        <p className="font-semibold">{dateFormatted}</p>
        <p className="text-sm text-gray-900 font-semibold">{location}</p>
      </div>
      <a
        href={`/partida/${encodeURIComponent(date)}`} // ajuste para id real
        className="text-green-600 hover:bg-green-600 hover:text-white text-sm bg-slate-50 rounded p-1 pl-2 pr-2"
      >
        Ver
      </a>
    </div>
  )
}
