import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/hooks/axios";
import { COLLECTION_DISQUALIFICATIONS_ROUTE, LAST_FIVE_DISQUALIFICATIONS_ROUTE, MEMBER_DISQUALIFICATIONS_ROUTE } from "@/constants/api_routes";
import { useTournamentStore } from "@/stores/tournaments";
import { toast } from "@/hooks/use-toast";

export const useFetchLastFiveDisqualifications = (tournamentId: string) => {
  return useQuery({
    queryKey: ["last-five-disqualifications", tournamentId],
    queryFn: () => api.get(LAST_FIVE_DISQUALIFICATIONS_ROUTE(tournamentId)).then((res) => res.data),
  });
};

export const useCreateDisqualification = () => {
  const { currentTournament } = useTournamentStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plate: string) => api.post(COLLECTION_DISQUALIFICATIONS_ROUTE(currentTournament?.id as string), { plate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["last-five-disqualifications", currentTournament?.id] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
      toast({
        title: "Sucesso",
        description: "Atleta desclassificado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao desclassificar atleta",
        description: "Ocorreu um erro ao desclassificar o atleta",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDisqualification = () => {
  const { currentTournament } = useTournamentStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (disqualificationId: string) => api.delete(MEMBER_DISQUALIFICATIONS_ROUTE(currentTournament?.id as string, disqualificationId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["last-five-disqualifications", currentTournament?.id] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
      toast({
        title: "Sucesso",
        description: "Atleta reclassificado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao reclassificar atleta",
        description: "Ocorreu um erro ao reclassificar o atleta",
        variant: "destructive",
      });
    },
  });
};