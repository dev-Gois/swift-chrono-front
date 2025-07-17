import { useParams } from "react-router-dom";
import { useFetchRanking } from "@/services/useRanking";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const CategoryRanking = () => {
  const { categoryId } = useParams();
  const { data: ranking, isLoading } = useFetchRanking(categoryId || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></span>
        <span className="text-muted-foreground text-lg">Carregando ranking...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-10">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Ranking da Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-center">Posição</TableHead>
                  <TableHead className="w-24 text-center">Placa</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Equipe</TableHead>
                  <TableHead className="w-32 text-center">Tempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(ranking) && ranking.length > 0 ? (
                  ranking.map((athlete: any, idx: number) => (
                    <TableRow
                      key={athlete.plate + athlete.position}
                      className={
                        idx === 0
                          ? "bg-yellow-100/60 font-bold"
                          : idx === 1
                          ? "bg-gray-200/60 font-semibold"
                          : idx === 2
                          ? "bg-orange-100/50 font-medium"
                          : idx % 2 === 0
                          ? "bg-muted/40"
                          : ""
                      }
                    >
                      <TableCell className="text-center text-lg">{athlete.position}</TableCell>
                      <TableCell className="text-center font-mono">{athlete.plate}</TableCell>
                      <TableCell>{athlete.name}</TableCell>
                      <TableCell>{athlete.category}</TableCell>
                      <TableCell>{athlete.team}</TableCell>
                      <TableCell className="text-center font-mono">{athlete.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum atleta encontrado para esta categoria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};