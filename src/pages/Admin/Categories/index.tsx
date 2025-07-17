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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Upload } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useFetchCategoriesPaginated } from "@/services/useCategories"
import { Loading } from "@/components/Loading"
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useImportCategoriesCSV } from "@/services/useCategories"
import { Category } from "./types"

export const Categories = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryLaps, setNewCategoryLaps] = useState(1)
  const { toast } = useToast()
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()
  const { mutate: importCategoriesCSV, isPending: isImporting } = useImportCategoriesCSV()

  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const { data: categoriesPaginated, isLoading } = useFetchCategoriesPaginated(page, itemsPerPage)

  const categories = categoriesPaginated?.categories || []
  const pagy = categoriesPaginated?.pagy

  const resetImportForm = () => {
    setSelectedFile(null)
  }

  const handleCreate = () => {
    if (!newCategoryName.trim()) return

    createCategory(
      { category: { name: newCategoryName, laps: newCategoryLaps } },
      {
        onSuccess: () => {
          setNewCategoryName("")
          setIsCreateModalOpen(false)
          toast({
            title: "Sucesso!",
            description: "Categoria criada com sucesso.",
          })
        },
        onError: () => {
          toast({
            title: "Erro!",
            description: "Erro ao criar categoria.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleEdit = () => {
    if (!selectedCategory?.id || !newCategoryName.trim()) return

    updateCategory(
      { 
        id: selectedCategory.id,
        category: { name: newCategoryName, laps: newCategoryLaps }
      },
      {
        onSuccess: () => {
          setNewCategoryName("")
          setIsEditModalOpen(false)
          setSelectedCategory(null)
          toast({
            title: "Sucesso!",
            description: "Categoria atualizada com sucesso.",
          })
        },
        onError: () => {
          toast({
            title: "Erro!",
            description: "Erro ao atualizar categoria.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleDelete = (category: Category) => {
    if (!category.id) return

    deleteCategory(category.id, {
      onSuccess: () => {
        setSelectedCategory(null)
        toast({
          title: "Sucesso!",
          description: "Categoria deletada com sucesso.",
        })
      },
      onError: () => {
        toast({
          title: "Erro!",
          description: "Erro ao deletar categoria.",
          variant: "destructive",
        })
      }
    })
  }

  const handleImportCSV = () => {
    if (!selectedFile) return

    importCategoriesCSV(selectedFile, {
      onSuccess: () => {
        resetImportForm()
        setIsImportModalOpen(false)
        toast({
          title: "Sucesso!",
          description: "Categorias importadas com sucesso.",
        })
      },
      onError: () => {
        toast({
          title: "Erro!",
          description: "Erro ao importar categorias.",
          variant: "destructive",
        })
      }
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setSelectedFile(file)
    } else {
      toast({
        title: "Erro!",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
              <p className="text-muted-foreground">
                Gerencie as categorias do torneio.
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar CSV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Importar Categorias via CSV</DialogTitle>
                    <DialogDescription>
                      Selecione um arquivo CSV para importar categorias em lote.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="csv-file">Arquivo CSV</Label>
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        placeholder="Selecione um arquivo CSV"
                      />
                    </div>
                    {selectedFile && (
                      <div className="text-sm text-muted-foreground">
                        Arquivo selecionado: {selectedFile.name}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      resetImportForm()
                      setIsImportModalOpen(false)
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleImportCSV} disabled={isImporting || !selectedFile}>
                      {isImporting ? "Importando..." : "Importar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Categoria</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova categoria ao torneio.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Digite o nome da categoria"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="laps">Voltas</Label>
                      <Input
                        id="laps"
                        value={newCategoryLaps}
                        onChange={(e) => setNewCategoryLaps(Number(e.target.value))}
                        placeholder="Digite o número de voltas"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreate} disabled={isCreating}>
                      {isCreating ? "Criando..." : "Criar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
                    <TableHead>Voltas</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(categories) && categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.laps}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Dialog
                            open={isEditModalOpen && selectedCategory?.id === category.id}
                            onOpenChange={(open) => {
                              if (open) {
                                setSelectedCategory(category)
                                setNewCategoryName(category.name)
                              } else {
                                setSelectedCategory(null)
                                setNewCategoryName("")
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
                                <DialogTitle>Editar Categoria</DialogTitle>
                                <DialogDescription>
                                  Atualize as informações da categoria.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Nome</Label>
                                  <Input
                                    id="edit-name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Digite o nome da categoria"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-laps">Voltas</Label>
                                  <Input
                                    id="edit-laps"
                                    value={newCategoryLaps}
                                    onChange={(e) => setNewCategoryLaps(Number(e.target.value))}
                                    placeholder="Digite o número de voltas"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsEditModalOpen(false)
                                    setSelectedCategory(null)
                                    setNewCategoryName("")
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
                                  Esta ação não pode ser desfeita. Isso irá permanentemente deletar a categoria.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(category)}
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
          {/* Navegador de Paginação */}
          {pagy && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={pagy.page === 1}
              >
                « Primeira
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagy.prev && setPage(pagy.prev)}
                disabled={!pagy.prev}
              >
                ‹ Anterior
              </Button>
              <span className="px-2">Página {pagy.page} de {pagy.last}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagy.next && setPage(pagy.next)}
                disabled={!pagy.next}
              >
                Próxima ›
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagy.last)}
                disabled={pagy.page === pagy.last}
              >
                Última »
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}