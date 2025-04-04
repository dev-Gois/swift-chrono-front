import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCreateTournament } from "@/services/useTournaments"

interface NewTournamentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function NewTournamentModal({ isOpen, setIsOpen }: NewTournamentModalProps) {
  const [name, setName] = useState("")
  const { mutate: createTournament, isPending } = useCreateTournament()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTournament(
      { tournament: { name } },
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
