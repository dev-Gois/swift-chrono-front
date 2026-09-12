import { useEffect, useState } from "react"

type Call = { id: string; plates: string[] }

export const TrainingDisplay = () => {
  const [calls, setCalls] = useState<Call[]>([])
  const [total, setTotal] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const channel = new BroadcastChannel("swift-chrono-training")
    channel.onmessage = (event) => {
      const message = event.data as { type: string; total?: number; plates?: string[]; id?: string }
      if (message.type === "start") {
        setCalls([])
        setTotal(message.total || 0)
        setStarted(true)
      }
      if (message.type === "call" && message.plates?.length && message.id) {
        const call = { id: message.id, plates: message.plates }
        setCalls((current) => [...current.slice(-7), call])
        window.setTimeout(() => setCalls((current) => current.filter((item) => item.id !== call.id)), 5500)
      }
      if (message.type === "end") {
        setCalls([])
        setStarted(false)
      }
    }
    return () => channel.close()
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] p-8 text-white">
      <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Treino de chegada</h1>
        <span className="font-mono text-sm text-white/50">{started ? `${total} placas na sessão` : "Aguardando início"}</span>
      </header>
      <section aria-live="polite" className="grid min-h-[calc(100vh-10rem)] grid-cols-2 content-center gap-6 md:grid-cols-3 lg:grid-cols-4">
        {calls.flatMap((call) => call.plates.map((plate) => (
          <div key={`${call.id}-${plate}`} className="animate-[training-card-in_180ms_ease-out] rounded-lg border border-white/15 bg-white/[0.06] p-8 text-center font-mono text-5xl font-bold shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-opacity">
            {plate}
          </div>
        )))}
        {!calls.length && <p className="col-span-full text-center text-xl text-white/45">{started ? "A próxima chegada aparecerá aqui" : "Abra esta tela no segundo monitor e inicie o treino"}</p>}
      </section>
      <style>{`@keyframes training-card-in { from { opacity: 0; transform: scale(.84); } to { opacity: 1; transform: scale(1); } }`}</style>
    </main>
  )
}
