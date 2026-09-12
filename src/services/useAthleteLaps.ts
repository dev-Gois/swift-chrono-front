import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BATCH_ATHLETE_LAPS_ROUTE, BATCH_DESTROY_ATHLETE_LAPS_ROUTE, COLLECTION_ATHLETE_LAPS_ROUTE, CORRECT_ATHLETE_LAP_ROUTE, LAST_FIVE_LAPS_ROUTE, MEMBER_ATHLETE_LAPS_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"
import { useTournamentStore } from "@/stores/tournaments"
import { toast } from "@/hooks/use-toast"
import { AxiosError } from "axios"

export type CreateAthleteLapInput = {
  plate: string
  recordedAt?: string
  silent?: boolean
}

export type BatchArrivalInput = { plate: string; recordedAt: string }

export const useCreateAthleteLap = () => {
  const { currentTournament } = useTournamentStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ plate, recordedAt }: CreateAthleteLapInput) => api.post(
      COLLECTION_ATHLETE_LAPS_ROUTE(currentTournament?.id as string),
      { plate, recorded_at: recordedAt }
    ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["athlete_laps"] })
      queryClient.invalidateQueries({ queryKey: ["last_five_laps"] })
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
      if (!variables.silent) {
        toast({
          title: "Sucesso!",
          description: "Volta adicionada com sucesso."
        })
      }
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Erro!",
        description: error.response?.data.error || "Não foi possível adicionar a volta.",
        variant: "destructive"
      })
    },
  })
}

export const useCreateAthleteLapBatch = () => {
  const { currentTournament } = useTournamentStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (arrivals: BatchArrivalInput[]) => api.post(BATCH_ATHLETE_LAPS_ROUTE(currentTournament?.id as string), {
      arrivals: arrivals.map((arrival) => ({ plate: arrival.plate, recorded_at: arrival.recordedAt }))
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete_laps"] })
      queryClient.invalidateQueries({ queryKey: ["last_five_laps"] })
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
    }
  })
}

export const useDestroyAthleteLapBatch = () => {
  const { currentTournament } = useTournamentStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => api.delete(BATCH_DESTROY_ATHLETE_LAPS_ROUTE(currentTournament?.id as string), { data: { ids } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete_laps"] })
      queryClient.invalidateQueries({ queryKey: ["last_five_laps"] })
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
    }
  })
}

export const useCorrectAthleteLap = () => {
  const { currentTournament } = useTournamentStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, plate }: { id: string; plate: string }) => api.patch(CORRECT_ATHLETE_LAP_ROUTE(currentTournament?.id as string, id), { plate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete_laps"] })
      queryClient.invalidateQueries({ queryKey: ["last_five_laps"] })
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
    }
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
    queryFn: () => api.get(`${COLLECTION_ATHLETE_LAPS_ROUTE(currentTournament?.id as string)}?page=${page}&limit=${items}`).then((res) => res.data),
    enabled: !!currentTournament?.id
  })
}

export const useDeleteAthleteLap = () => {
  const { currentTournament } = useTournamentStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(MEMBER_ATHLETE_LAPS_ROUTE(currentTournament?.id as string, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["last_five_laps"] })
      queryClient.invalidateQueries({ queryKey: ["athlete_laps"] })
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
      toast({
        title: "Sucesso!",
        description: "Volta deletada com sucesso."
      })
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Erro!",
        description: error.response?.data.error || "Não foi possível remover a volta.",
        variant: "destructive"
      })
    },
  })
}
