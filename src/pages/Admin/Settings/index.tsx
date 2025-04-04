import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTournamentStore } from "@/stores/tournaments"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { tournamentFormSchema, TournamentFormValues } from "./utils"

export default function Settings() {
  const { currentTournament } = useTournamentStore()
  const { theme, setTheme } = useTheme()

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: currentTournament?.name || "",
    },
  })

  const handleSave = (data: TournamentFormValues) => {
    console.log("Salvando...", data)
  }

  const handleDelete = () => {
    // TODO: Implementar deleção
    console.log("Deletando...")
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
              <Button type="submit">Salvar Alterações</Button>
            </form>
          </Form>
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
        <CardFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Deletar Torneio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 