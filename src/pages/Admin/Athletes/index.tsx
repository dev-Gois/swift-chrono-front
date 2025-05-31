import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAthletesStore } from "@/stores/athletes"
import { useCategoriesStore } from "@/stores/categories"
import { useFetchAthletes } from "@/services/useAthletes"
import { useFetchCategories } from "@/services/useCategories"
import { Loading } from "@/components/Loading"
import { useCreateAthlete, useUpdateAthlete, useDeleteAthlete } from "@/services/useAthletes"

interface Athlete {
  id: string
  name: string
  plate: string
  category_id: string
}

export const Athletes = () => {
  const { athletes } = useAthletesStore()
  const { categories } = useCategoriesStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    plate: "",
    category_id: ""
  })
  const { toast } = useToast()
  const { mutate: createAthlete, isPending: isCreating } = useCreateAthlete()
  const { mutate: updateAthlete, isPending: isUpdating } = useUpdateAthlete()
  const { mutate: deleteAthlete, isPending: isDeleting } = useDeleteAthlete()

  const { isLoading: isLoadingAthletes } = useFetchAthletes()
  const { isLoading: isLoadingCategories } = useFetchCategories()

  const resetForm = () => {
    setFormData({
      name: "",
      plate: "",
      category_id: ""
    })
  }

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.plate.trim() || !formData.category_id) return

    createAthlete(
      { athlete: formData },
      {
        onSuccess: () => {
          resetForm()
          setIsCreateModalOpen(false)
          toast({
            title: "Sucesso!",
            description: "Atleta criado com sucesso.",
          })
        },
        onError: () => {
          toast({
            title: "Erro!",
            description: "Erro ao criar atleta.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleEdit = () => {
    if (!selectedAthlete?.id || !formData.name.trim() || !formData.plate.trim() || !formData.category_id) return

    updateAthlete(
      {
        id: selectedAthlete.id,
        athlete: formData
      },
      {
        onSuccess: () => {
          resetForm()
          setIsEditModalOpen(false)
          setSelectedAthlete(null)
          toast({
            title: "Sucesso!",
            description: "Atleta atualizado com sucesso.",
          })
        },
        onError: () => {
          toast({
            title: "Erro!",
            description: "Erro ao atualizar atleta.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleDelete = (athlete: Athlete) => {
    if (!athlete.id) return

    deleteAthlete(athlete.id, {
      onSuccess: () => {
        setSelectedAthlete(null)
        toast({
          title: "Sucesso!",
          description: "Atleta deletado com sucesso.",
        })
      },
      onError: () => {
        toast({
          title: "Erro!",
          description: "Erro ao deletar atleta.",
          variant: "destructive",
        })
      }
    })
  }

  const isLoading = isLoadingAthletes || isLoadingCategories

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Atletas</h2>
              <p className="text-muted-foreground">
                Gerencie os atletas do torneio.
              </p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Atleta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Atleta</DialogTitle>
                  <DialogDescription>
                    Adicione um novo atleta ao torneio.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome do atleta"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plate">Placa</Label>
                    <Input
                      id="plate"
                      value={formData.plate}
                      onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value }))}
                      placeholder="Digite o número da placa"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(categories) && categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    resetForm()
                    setIsCreateModalOpen(false)
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={isCreating}>
                    {isCreating ? "Criando..." : "Criar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="rounded-md border overflow-x-auto">
            {isLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Loading />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(athletes) && athletes.map((athlete) => (
                    <TableRow key={athlete.id}>
                      <TableCell className="font-medium">{athlete.id}</TableCell>
                      <TableCell>{athlete.name}</TableCell>
                      <TableCell>{athlete.plate}</TableCell>
                      <TableCell>
                        {categories.find(c => c.id === athlete.category_id)?.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Dialog
                            open={isEditModalOpen && selectedAthlete?.id === athlete.id}
                            onOpenChange={(open) => {
                              if (open) {
                                setSelectedAthlete(athlete)
                                setFormData({
                                  name: athlete.name,
                                  plate: athlete.plate,
                                  category_id: athlete.category_id
                                })
                              } else {
                                setSelectedAthlete(null)
                                resetForm()
                              }
                              setIsEditModalOpen(open)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Atleta</DialogTitle>
                                <DialogDescription>
                                  Atualize as informações do atleta.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Nome</Label>
                                  <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Digite o nome do atleta"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-plate">Placa</Label>
                                  <Input
                                    id="edit-plate"
                                    value={formData.plate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value }))}
                                    placeholder="Digite o número da placa"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-category">Categoria</Label>
                                  <Select
                                    value={formData.category_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.isArray(categories) && categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                          {category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsEditModalOpen(false)
                                    setSelectedAthlete(null)
                                    resetForm()
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button onClick={handleEdit} disabled={isUpdating}>
                                  {isUpdating ? "Salvando..." : "Salvar"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso irá permanentemente deletar o atleta.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(athlete)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isDeleting ? "Deletando..." : "Deletar"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}