import { useRankingCategories } from "@/services/useRanking";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
export const Ranking = () => {
  const { data: categories, isLoading } = useRankingCategories();
    const navigate = useNavigate();
    return (
    <div className="max-w-5xl mx-auto w-full py-10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-1">Ranking por Categoria</h2>
        <p className="text-muted-foreground text-base">Escolha uma categoria para visualizar o ranking dos atletas.</p>
      </div>
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground animate-pulse">Carregando categorias...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories?.categories && categories?.categories?.length > 0 ? (
            categories?.categories?.map((cat: any) => (
              <Card
                key={cat.id}
                className="flex items-center justify-center h-32 rounded-xl shadow-md border border-primary/10 transition-all duration-200 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 active:scale-95 cursor-pointer group bg-white"
                onClick={() => navigate(`/dashboard/ranking/${cat.id}`)}
              >
                <CardContent className="flex flex-col items-center justify-center w-full h-full p-4">
                  <span className="text-lg font-semibold text-primary group-hover:text-primary/80 text-center truncate w-full">
                    {cat.name}
                  </span>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">Nenhuma categoria encontrada.</div>
          )}
        </div>
      )}
    </div>
  );
};