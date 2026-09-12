import { useTournamentStore } from "@/stores/tournaments";
import { useQuery } from "@tanstack/react-query";
import { RANKING_ROUTE } from "@/constants/api_routes";
import { api } from "@/hooks/axios";

export interface RankingRow {
  position: number;
  plate: string;
  name: string;
  category: string;
  ranking_name?: string;
  can_exclude_general?: boolean;
  team: string | null;
  time: string;
  is_pair_category: boolean;
}

export const useRankingCategories = () => {
  const tournamentId = useTournamentStore((state) => state.currentTournament?.id);
  return useQuery({
    queryKey: ["ranking-categories", tournamentId],
    enabled: !!tournamentId,
    queryFn: () => api.get(`/tournaments/${tournamentId}/ranking_categories`).then((res) => res.data),
  });
};

export const useFetchRanking = (categoryId: string) => {
  return useQuery({
    queryKey: ["ranking", categoryId],
    queryFn: () => api.get<RankingRow[]>(RANKING_ROUTE(categoryId)).then((res) => res.data),
  });
};

export const downloadRankingPdf = async (categoryId: string, excludeGeneralPodium = false) => {
  const response = await api.get(`/ranking/${categoryId}/export_pdf`, {
    responseType: 'blob',
    params: { exclude_general_podium: excludeGeneralPodium },
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `ranking_${categoryId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};