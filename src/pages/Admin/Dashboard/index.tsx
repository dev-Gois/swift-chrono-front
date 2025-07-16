import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAthletesStore } from "@/stores/athletes"
import { Play, Pause, Square, Undo2, Send } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Arrival {
  id: string
  athlete: {
    id: string
    name: string
    plate: string
  }
  time: number // tempo em milissegundos
  arrivalTime: Date
  disqualified?: boolean
  disqualificationReason?: string
}

export const Dashboard = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [plateInput, setPlateInput] = useState("")
  const [arrivals, setArrivals] = useState<Arrival[]>([])
  const [isStopModalOpen, setIsStopModalOpen] = useState(false)
  const [isDsqModalOpen, setIsDsqModalOpen] = useState(false)
  const [isManualTimeModalOpen, setIsManualTimeModalOpen] = useState(false)
  const [selectedArrival, setSelectedArrival] = useState<Arrival | null>(null)
  const [dsqReason, setDsqReason] = useState("")
  const [confirmationText, setConfirmationText] = useState("")
  const [notes, setNotes] = useState("")
  const { athletes } = useAthletesStore()
  const { toast } = useToast()
  const timerRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<Date>()

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = new Date(Date.now() - time)
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current!.getTime())
      }, 10)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning])

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

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStopClick = () => {
    setIsStopModalOpen(true)
  }

  const handleStopConfirm = () => {
    if (confirmationText !== "FINALIZAR") {
      toast({
        title: "Erro!",
        description: 'Digite "FINALIZAR" para confirmar.',
        variant: "destructive",
      })
      return
    }

    setIsRunning(false)
    setTime(0)
    setArrivals([])
    setIsStopModalOpen(false)
    setConfirmationText("")
    
    toast({
      title: "Prova finalizada!",
      description: "Todos os dados foram resetados.",
    })
  }

  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isRunning) {
      toast({
        title: "Erro!",
        description: "O cronômetro precisa estar rodando para registrar chegadas.",
        variant: "destructive",
      })
      return
    }

    const athlete = athletes.find(a => a.plate === plateInput)
    if (!athlete) {
      toast({
        title: "Erro!",
        description: "Placa não encontrada.",
        variant: "destructive",
      })
      return
    }

    if (arrivals.some(a => a.athlete.id === athlete.id)) {
      toast({
        title: "Erro!",
        description: "Este atleta já foi registrado.",
        variant: "destructive",
      })
      return
    }

    const arrival: Arrival = {
      id: crypto.randomUUID(),
      athlete: {
        id: athlete.id,
        name: athlete.name,
        plate: athlete.plate,
      },
      time,
      arrivalTime: new Date(),
    }

    setArrivals(prev => [arrival, ...prev])
    setPlateInput("")
    
    toast({
      title: "Sucesso!",
      description: `${athlete.name} registrado com tempo ${formatTime(time)}`,
    })
  }

  const handleUndo = (arrival: Arrival) => {
    setArrivals(prev => prev.filter(a => a.id !== arrival.id))
    
    toast({
      title: "Chegada desfeita",
      description: `Registro de ${arrival.athlete.name} foi removido`,
    })
  }

  const handleDisqualify = () => {
    if (!selectedArrival || !dsqReason.trim()) return

    setArrivals(prev => prev.map(arrival => 
      arrival.id === selectedArrival.id
        ? { ...arrival, disqualified: true, disqualificationReason: dsqReason }
        : arrival
    ))

    toast({
      title: "Atleta desclassificado",
      description: `${selectedArrival.athlete.name} foi desclassificado por: ${dsqReason}`,
    })

    setIsDsqModalOpen(false)
    setSelectedArrival(null)
    setDsqReason("")
  }

  const handleRemoveDisqualification = (arrival: Arrival) => {
    setArrivals(prev => prev.map(a => 
      a.id === arrival.id
        ? { ...a, disqualified: false, disqualificationReason: undefined }
        : a
    ))

    toast({
      title: "Desclassificação removida",
      description: `${arrival.athlete.name} teve sua desclassificação removida`,
    })
  }

  const recentArrivals = arrivals.slice(0, 5)

  return (
    <div className="h-full overflow-hidden p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cronômetro e Controles */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-center text-6xl font-mono">
              {formatTime(time)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
              ) : (
                <Button onClick={handlePause} size="lg" variant="secondary">
                  <Pause className="mr-2 h-4 w-4" />
                  Pausar
                </Button>
              )}
              <Button onClick={handleStopClick} size="lg" variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Parar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registro de Chegada */}
        <Card>
          <CardHeader>
            <CardTitle>Registrar Chegada</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePlateSubmit} className="flex gap-2">
              <Input
                placeholder="Número da placa"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value)}
                className="text-lg"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Últimas Chegadas</h3>
              <div className="space-y-2">
                {recentArrivals.map((arrival) => (
                  <div
                    key={arrival.id}
                    className={`flex justify-between items-center p-2 bg-muted rounded-lg ${
                      arrival.disqualified ? "opacity-50" : ""
                    }`}
                  >
                    <div>
                      <span className="font-mono">{arrival.athlete.plate}</span>
                      {" - "}
                      <span>{arrival.athlete.name}</span>
                      {arrival.disqualified && (
                        <span className="ml-2 text-destructive">[DSQ]</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{formatTime(arrival.time)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUndo(arrival)}
                        className="h-8 w-8"
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDsqModalOpen(true)}
              className="w-full"
            >
              Desclassificar
            </Button>
          </CardContent>
        </Card>

        <Dialog open={isStopModalOpen} onOpenChange={setIsStopModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finalizar Prova</DialogTitle>
              <DialogDescription>
                Esta ação irá parar o cronômetro e apagar todos os dados.
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
              <Button
                variant="outline"
                onClick={() => {
                  setIsStopModalOpen(false)
                  setConfirmationText("")
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleStopConfirm}
                disabled={confirmationText !== "FINALIZAR"}
              >
                Finalizar Prova
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDsqModalOpen} onOpenChange={setIsDsqModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Desclassificar Atleta</DialogTitle>
              <DialogDescription>
                Selecione um atleta e informe o motivo da desclassificação.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Atleta</Label>
                <Select
                  value={selectedArrival?.id}
                  onValueChange={(value) => {
                    const arrival = arrivals.find(a => a.id === value)
                    setSelectedArrival(arrival || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um atleta" />
                  </SelectTrigger>
                  <SelectContent>
                    {arrivals
                      .filter(a => !a.disqualified)
                      .map((arrival) => (
                        <SelectItem key={arrival.id} value={arrival.id}>
                          {arrival.athlete.plate} - {arrival.athlete.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Motivo</Label>
                <Input
                  placeholder="Informe o motivo da desclassificação"
                  value={dsqReason}
                  onChange={(e) => setDsqReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDsqModalOpen(false)
                  setSelectedArrival(null)
                  setDsqReason("")
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDisqualify}
                disabled={!selectedArrival || !dsqReason.trim()}
              >
                Desclassificar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 