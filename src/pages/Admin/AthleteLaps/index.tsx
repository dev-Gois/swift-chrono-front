import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchAthleteLaps } from "@/services/useAthleteLaps"
import { Medal, RotateCcw } from "lucide-react"
import { useDeleteAthleteLap } from "@/services/useAthleteLaps"

export const AthleteLaps = () => {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const { data, isLoading } = useFetchAthleteLaps(page, itemsPerPage)
  const deleteAthleteLap = useDeleteAthleteLap()
  
  const laps = data?.laps?.data || []
  const pagy = data?.pagy
  
  const handleUndo = (lapId: string) => {
    deleteAthleteLap.mutate(lapId)
  }

  return (
    <div className="h-full flex flex-col items-start justify-start pt-12 px-6">
      <Card className="w-full shadow-xl border-2 border-primary">
        <CardHeader className="flex flex-row items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2">
            <Medal className="w-6 h-6 text-primary" />
          </span>
          <CardTitle className="text-2xl font-bold text-primary tracking-tight">
            Voltas Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] font-semibold">ID</TableHead>
                <TableHead className="font-semibold">PLACA</TableHead>
                <TableHead className="font-semibold">ATLETA</TableHead>
                <TableHead className="font-semibold">TEMPO DA VOLTA</TableHead>
                <TableHead className="w-[120px] font-semibold text-center">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : laps.length ? (
                laps.map((lap: any) => (
                  <TableRow key={lap.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      #{lap.id}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-primary/10 px-2">
                        {lap.attributes.athlete.attributes.plate}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {lap.attributes.athlete.attributes.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {lap.attributes.formatted_time}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndo(lap.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" /> Desfazer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma volta registrada ainda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
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
        </CardContent>
      </Card>
    </div>
  )
}