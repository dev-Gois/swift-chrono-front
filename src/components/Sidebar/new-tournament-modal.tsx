import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

type NewTournamentModalProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const NewTournamentModal = ({ isOpen, setIsOpen }: NewTournamentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Competição</DialogTitle>
          <DialogDescription>
            Crie uma nova competição.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input type="text" placeholder="Nome da competição" />
          <Button type="submit">Criar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
