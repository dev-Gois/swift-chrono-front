import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTournamentStore } from "@/stores/tournaments"
import { useFetchTournament, useFinishTournament, useStartTournament } from "@/services/useTournaments"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Bike, Ban } from "lucide-react"
import { useCreateAthleteLap, useDeleteAthleteLap, useLastFiveLaps } from "@/services/useAthleteLaps"
import { useCreateDisqualification, useDeleteDisqualification, useFetchLastFiveDisqualifications } from "@/services/useDisqualifications"

export const Cronometer = () => {
  const { currentTournament } = useTournamentStore()
  const { data: tournament } = useFetchTournament(currentTournament?.id as string)

  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [time, setTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [plate, setPlate] = useState("")
  const [disqualificationPlate, setDisqualificationPlate] = useState("")
  const { mutate: startTournament } = useStartTournament()
  const { mutate: finishTournament } = useFinishTournament()
  const { mutate: createAthleteLap } = useCreateAthleteLap()
  const { data: lastFiveLaps } = useLastFiveLaps()
  const { mutate: deleteAthleteLap } = useDeleteAthleteLap()
  const { mutate: createDisqualification } = useCreateDisqualification()
  const { mutate: deleteDisqualification } = useDeleteDisqualification()
  const { data: lastFiveDisqualifications } = useFetchLastFiveDisqualifications(currentTournament?.id as string)

  const handleFinish = () => {
    setIsModalOpen(true)
  }
  const handleConfirmFinish = () => {
    stopTimer()
    finishTournament()
    setIsModalOpen(false)
    setConfirmationText("")
  }

  const handleStart = () => {
    startTournament()
  }
  
  const handleCreateAthleteLap = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!plate) return
    createAthleteLap(plate)
    setPlate("")
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`
  }

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 10)
    }, 10)
  }

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleCreateDisqualification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!disqualificationPlate) return
    createDisqualification(disqualificationPlate)
    setDisqualificationPlate("")
  }

  useEffect(() => {
    if (tournament && tournament.started_at) {
      const startedAt = new Date(tournament.started_at)
      if (tournament.finished_at) {
        const finishedAt = new Date(tournament.finished_at)
        const timeDiff = finishedAt.getTime() - startedAt.getTime()
        setTime(timeDiff)
        setIsFinished(true)
        stopTimer()
        return
      }
      const now = new Date()
      const timeDiff = now.getTime() - startedAt.getTime()
      setTime(timeDiff)
      setIsStarted(true)
      startTimer()
    }
  }, [tournament])

  return (
    <div className="h-full flex flex-col items-center justify-start pt-12">
      <Card className="w-full max-w-md mx-auto mb-8 shadow-xl border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-center text-5xl font-mono text-primary">
            {formatTime(time)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={handleStart} disabled={isStarted || isFinished} size="lg">
              Iniciar
            </Button>
            <Button onClick={handleFinish} disabled={!isStarted || isFinished} variant="destructive" size="lg">
              Finalizar
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Sections abaixo do cronômetro */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        {/* Section esquerda: Card de chegada de atleta */}
        <section className="flex-1">
          <div className="rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-1">
            <Card className="rounded-2xl bg-white/90 dark:bg-zinc-900/80 shadow-none border-0">
              <CardHeader className="pb-2 flex flex-row items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 mr-2">
                  <Bike className="w-6 h-6 text-primary" />
                </span>
                <CardTitle className="text-xl font-bold text-primary tracking-tight">Registrar Chegada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAthleteLap} className="flex flex-col gap-6 px-2 py-2">
                  <Input
                    placeholder="Digite a placa do atleta"
                    className="text-lg py-6 px-4 border-2 border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/30 rounded-xl transition-all duration-200 shadow-sm"
                    onChange={(e) => setPlate(e.target.value)}
                    value={plate}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary/60 shadow-lg transition-all duration-200"
                  >
                    Registrar
                  </Button>
                </form>
                {/* Listagem de chegadas */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">Chegadas Registradas</h3>
                  <div className="space-y-3">
                  {lastFiveLaps?.laps?.data?.map((lap: any) => (
                      <div key={lap.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm bg-primary/10 px-2 py-1 rounded">{lap.attributes.athlete.attributes.plate}</span>
                          <span className="font-medium">{lap.attributes.athlete.attributes.name}</span>
                          <span className="font-mono text-sm text-muted-foreground">{lap.attributes.formatted_time}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteAthleteLap(lap.id)}>
                          Desfazer
                        </Button>
                      </div>
                    ))}
                    {!lastFiveLaps?.laps?.data?.length && (
                      <div className="text-center text-muted-foreground py-4">
                        Nenhuma volta registrada ainda
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        {/* Section direita: Card de desclassificar atleta */}
        <section className="flex-1">
          <div className="rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-destructive/10 via-background to-destructive/5 p-1">
            <Card className="rounded-2xl bg-white/90 dark:bg-zinc-900/80 shadow-none border-0">
              <CardHeader className="pb-2 flex flex-row items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 p-2 mr-2">
                  <Ban className="w-6 h-6 text-destructive" />
                </span>
                <CardTitle className="text-xl font-bold text-destructive tracking-tight">Desclassificar Atleta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDisqualification} className="flex flex-col gap-6 px-2 py-2">
                  <Input
                    placeholder="Digite a placa do atleta"
                    className="text-lg py-6 px-4 border-2 border-destructive/40 focus:border-destructive focus:ring-4 focus:ring-destructive/30 rounded-xl transition-all duration-200 shadow-sm"
                    value={disqualificationPlate}
                    onChange={(e) => setDisqualificationPlate(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold text-lg bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/80 hover:to-destructive/60 shadow-lg transition-all duration-200"
                  >
                    Desclassificar
                  </Button>
                </form>
                {/* Listagem de desclassificações */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-destructive mb-4">Atletas Desclassificados</h3>
                  <div className="space-y-3">
                    {lastFiveDisqualifications?.disqualifications?.map((disqualification: any) => (
                      <div key={disqualification.id} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm bg-destructive/10 px-2 py-1 rounded">{disqualification.plate}</span>
                          <span className="font-medium">{disqualification.name}</span>
                          <span className="text-sm text-muted-foreground">{disqualification.category}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => deleteDisqualification(disqualification.id)}>
                          Reverter
                        </Button>
                      </div>
                    ))}
                    {!lastFiveDisqualifications?.disqualifications?.length && (
                      <div className="text-center text-muted-foreground py-4">
                        Nenhum atleta desclassificado ainda
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Prova</DialogTitle>
            <DialogDescription>
              Esta ação irá parar o cronômetro e finalizar o torneio.
              Digite "FINALIZAR" para confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder='Digite "FINALIZAR"'
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="text-lg text-center"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmFinish}
              disabled={confirmationText !== "FINALIZAR"}
            >
              Finalizar Prova
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}   