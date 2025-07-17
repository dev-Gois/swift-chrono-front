import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { COLLECTION_ATHLETE_LAPS_ROUTE, LAST_FIVE_LAPS_ROUTE, MEMBER_ATHLETE_LAPS_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"
import { useTournamentStore } from "@/stores/tournaments"
import { toast } from "@/hooks/use-toast"

export const useCreateAthleteLap = () => {
  const { currentTournament } = useTournamentStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (plate: string) => api.post(COLLECTION_ATHLETE_LAPS_ROUTE(currentTournament?.id as string), { plate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete_laps"] })
      toast({
        title: "Sucesso!",
        description: "Volta adicionada com sucesso."
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erro!",
        description: error.response.data.error,
        variant: "destructive"
      })
    },
  })
}

export const useLastFiveLaps = () => {
  const { currentTournament } = useTournamentStore()

  return useQuery({
    queryKey: ["last_five_laps"],
    queryFn: () => api.get(LAST_FIVE_LAPS_ROUTE(currentTournament?.id as string)).then((res) => res.data),
    enabled: !!currentTournament?.id
  })
}

export const useFetchAthleteLaps = (page: number = 1, items: number = 10) => {
  const { currentTournament } = useTournamentStore()

  return useQuery({
    queryKey: ["athlete_laps", currentTournament?.id, page, items],
    queryFn: () => api.get(`${COLLECTION_ATHLETE_LAPS_ROUTE(currentTournament?.id as string)}?page=${page}&items=${items}`).then((res) => res.data),
    enabled: !!currentTournament?.id
  })
}

export const useDeleteAthleteLap = () => {
  const { currentTournament } = useTournamentStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(MEMBER_ATHLETE_LAPS_ROUTE(currentTournament?.id as string, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["last_five_laps", "athlete_laps"] })
      toast({
        title: "Sucesso!",
        description: "Volta deletada com sucesso."
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erro!",
        description: error.response.data.error,
        variant: "destructive"
      })
    },
  })
}