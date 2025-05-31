import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCreateTournament } from "@/services/useTournaments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewTournamentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function NewTournamentModal({ isOpen, setIsOpen }: NewTournamentModalProps) {
  const [name, setName] = useState("")
  const [tournamentType, setTournamentType] = useState<"sprint" | "laps">("sprint")
  const { mutate: createTournament, isPending } = useCreateTournament()

  const handleTypeChange = (value: string) => {
    setTournamentType(value as "sprint" | "laps")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTournament(
      { tournament: { name, tournament_type: tournamentType } },
      {
        onSuccess: () => {
          setName("")
          setIsOpen(false)
        }
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Torneio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Torneio</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do torneio"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tournamentType">Tipo de Torneio</Label>
            <Select value={tournamentType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de torneio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sprint">Sprint</SelectItem>
                <SelectItem value="laps">Por voltas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
