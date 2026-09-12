import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchRanking, downloadRankingPdf } from "@/services/useRanking";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CategoryRanking = () => {
  const { categoryId } = useParams();
  const [excludeGeneral, setExcludeGeneral] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const { data: ranking, isLoading, isError } = useFetchRanking(categoryId || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></span>
        <span className="text-muted-foreground text-lg">Carregando ranking...</span>
      </div>
    );
  }

  const canExcludeGeneral = ranking?.[0]?.can_exclude_general === true;
  const rankingName = ranking?.[0]?.ranking_name || ranking?.[0]?.category || "Ranking da Categoria";

  const handleDownloadPdf = async () => {
    if (!categoryId || downloading) return;
    setDownloading(true);
    setDownloadError("");
    try {
      await downloadRankingPdf(categoryId, canExcludeGeneral && excludeGeneral);
    } catch {
      setDownloadError("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-10">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{rankingName}</CardTitle>
          {Array.isArray(ranking) && ranking.length > 0 && (
            <div className="mt-4 space-y-3">
              {canExcludeGeneral && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={excludeGeneral}
                    onChange={(event) => setExcludeGeneral(event.target.checked)}
                  />
                  Excluir os 3 primeiros da classificação geral no PDF
                </label>
              )}
              <Button onClick={handleDownloadPdf} disabled={downloading}>
                {downloading ? "Gerando PDF..." : "Baixar PDF"}
              </Button>
              {downloadError && <p role="alert" className="text-sm text-destructive">{downloadError}</p>}
            </div>
          )}
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
                  ranking.map((athlete, idx) => (
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
                      {isError ? "Não foi possível carregar o ranking. Atualize a página para tentar novamente." : "Nenhum atleta encontrado para esta categoria."}
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
