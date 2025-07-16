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

export const Cronometer = () => {
  const { currentTournament } = useTournamentStore()
  const { data: tournament } = useFetchTournament(currentTournament?.id as string)

  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [time, setTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")

  const { mutate: startTournament } = useStartTournament()
  const { mutate: finishTournament } = useFinishTournament()

  const handleFinish = () => {
    setIsModalOpen(true)
  }
  const handleConfirmFinish = () => {
    finishTournament()
    setIsModalOpen(false)
    setConfirmationText("")
  }

  const handleStart = () => {
    startTournament()
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
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-5xl font-mono">
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