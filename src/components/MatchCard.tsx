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
    <div className="rounded-xl border p-4 shadow-sm flex justify-between items-center">
      <div>
        <p className="font-semibold">{dateFormatted}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
      {/* <a
        href={`/partida/${encodeURIComponent(date)}`} // ajuste para id real
        className="text-blue-600 hover:underline text-sm"
      >
        Ver
      </a> */}
    </div>
  )
}
