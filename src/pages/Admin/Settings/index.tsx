import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTournamentStore } from "@/stores/tournaments"
import { useTheme } from "@/components/theme-provider"
import { Moon, ShieldCheck, Sun } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { tournamentFormSchema, TournamentFormValues } from "./utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useDeleteTournament, useResetTournament, useUpdateTournament } from "@/services/useTournaments"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const { currentTournament } = useTournamentStore()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { mutate: deleteTournament, isPending: isDeleting } = useDeleteTournament()
  const { mutate: updateTournament, isPending: isUpdating } = useUpdateTournament()
  const { mutate: resetTournament, isPending: isResetting } = useResetTournament()
  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: currentTournament?.name || "",
    },
  })

  const handleSave = (data: TournamentFormValues) => {
    if (!currentTournament) return

    updateTournament(
      { id: currentTournament.id, tournament: { name: data.name } },
      {
        onSuccess: () => {
          toast({
            title: "Sucesso!",
            description: "Torneio atualizado com sucesso.",
          })
        },
        onError: () => {
          toast({
            title: "Erro!",
            description: "Não foi possível atualizar o torneio.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleDelete = () => {
    if (!currentTournament) return

    deleteTournament(currentTournament.id, {
      onSuccess: () => {
        toast({
          title: "Sucesso!",
          description: "Torneio deletado com sucesso.",
        })
        navigate("/dashboard")
      },
      onError: () => {
        toast({
          title: "Erro!",
          description: "Não foi possível deletar o torneio.",
          variant: "destructive",
        })
      }
    })
  }

  const handleReset = () => {
    if (!currentTournament) return

    resetTournament()
  }

  const toggleRaceDayMode = () => {
    if (!currentTournament) return
    updateTournament({ id: currentTournament.id, tournament: { race_day_mode: !currentTournament.race_day_mode } })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações do torneio e personalize sua experiência.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Torneio</CardTitle>
          <CardDescription>
            Atualize as informações básicas do seu torneio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Torneio</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do torneio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isUpdating || currentTournament?.race_day_mode}>
                {isUpdating ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className={currentTournament?.race_day_mode ? "border-amber-600" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Dia da Prova</CardTitle>
          <CardDescription>Bloqueia alterações em atletas, categorias e ações destrutivas da competição.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">{currentTournament?.race_day_mode ? "Proteção ativa" : "Proteção desativada"}</p>
          <Button variant={currentTournament?.race_day_mode ? "outline" : "default"} onClick={toggleRaceDayMode} disabled={isUpdating}>{currentTournament?.race_day_mode ? "Desativar" : "Ativar modo"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Personalize a aparência da aplicação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tema</Label>
              <p className="text-sm text-muted-foreground">
                Escolha entre tema claro ou escuro.
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis. Tenha certeza antes de prosseguir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Ao deletar este torneio, todos os dados associados serão permanentemente removidos.
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={currentTournament?.race_day_mode}>Deletar Torneio</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso irá permanentemente deletar o torneio
                  e remover todos os dados associados do nosso servidor.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deletando..." : "Deletar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={currentTournament?.race_day_mode}>Resetar Torneio</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso irá resetar o torneio
                  e remover todos os dados associados do nosso servidor.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={isResetting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isResetting ? "Resetando..." : "Resetar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
