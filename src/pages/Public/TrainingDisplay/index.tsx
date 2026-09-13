import { useEffect, useState } from "react"

type DisplaySlot = { key: string; plate: string } | null

const SLOT_COUNT = 32

const slotPosition = (index: number) => ({
  left: `${4 + (index % 8) * 12.2}%`,
  top: `${10 + Math.floor(index / 8) * 22}%`,
})

export const TrainingDisplay = () => {
  const [slots, setSlots] = useState<DisplaySlot[]>(() => Array.from({ length: SLOT_COUNT }, () => null))
  const [total, setTotal] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const channel = new BroadcastChannel("swift-chrono-training")
    channel.onmessage = (event) => {
      const message = event.data as { type: string; total?: number; plates?: string[]; id?: string }
      if (message.type === "start") {
        setSlots(Array.from({ length: SLOT_COUNT }, () => null))
        setTotal(message.total || 0)
        setStarted(true)
      }
      if (message.type === "call" && message.plates?.length && message.id) {
        const call = { id: message.id, plates: message.plates }
        setSlots((current) => {
          const next = [...current]
          call.plates.forEach((plate, index) => {
            const slotIndex = next.findIndex((slot) => slot === null)
            if (slotIndex !== -1) next[slotIndex] = { key: `${call.id}-${index}`, plate }
          })
          return next
        })
        window.setTimeout(() => setSlots((current) => current.map((slot) => slot?.key.startsWith(call.id) ? null : slot)), 5500)
      }
      if (message.type === "end") {
        setSlots(Array.from({ length: SLOT_COUNT }, () => null))
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
      <section aria-live="polite" className="relative min-h-[calc(100vh-10rem)] overflow-hidden">
        {slots.map((slot, index) => slot && (
          <div key={slot.key} style={slotPosition(index)} className="absolute w-[11%] min-w-[72px]">
            <div className="animate-[training-number-life_5500ms_ease-in-out_forwards] rounded-xl border border-white/15 bg-white/[0.07] px-3 py-5 text-center font-mono text-4xl font-bold shadow-[0_8px_30px_rgba(0,0,0,0.3)] md:text-5xl">
              {slot.plate}
            </div>
          </div>
        ))}
        {!slots.some(Boolean) && <p className="absolute inset-0 flex items-center justify-center text-center text-xl text-white/45">{started ? "A próxima chegada aparecerá aqui" : "Abra esta tela no segundo monitor e inicie o treino"}</p>}
      </section>
      <style>{`@keyframes training-number-life { 0% { opacity: 0; transform: translateY(18px) scale(.86); } 12% { opacity: 1; transform: translateY(0) scale(1); } 78% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-14px) scale(.94); } }`}</style>
    </main>
  )
}
