import { useAthletesStore } from "@/stores/athletes"
import { useTournamentStore } from "@/stores/tournaments"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { COLLECTION_ATHLETES_ROUTE, MEMBER_ATHLETES_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"
import { AthleteRequest, AthleteResponse } from "@/types/athlete"
import { ErrorResponse } from "@/types/request"

export const useFetchAthletes = () => {
  const setAthletes = useAthletesStore((state) => state.setAthletes)
  const { currentTournament } = useTournamentStore((state) => state)

  if (!currentTournament) {
    return {
      data: [],
      isLoading: false,
      error: null,
    }
  }

  return useQuery({
    queryKey: ["athletes", currentTournament.id],
    queryFn: async () => {
      const response = await api.get(COLLECTION_ATHLETES_ROUTE(), {
        params: {
          tournament_id: currentTournament.id,
        },
      })
      setAthletes(response.data)
      return response.data
    },
  })
}

export const useCreateAthlete = () => {
  const setAthletes = useAthletesStore((state) => state.setAthletes)
  const queryClient = useQueryClient()
  const { currentTournament } = useTournamentStore((state) => state)

  return useMutation<AthleteResponse, ErrorResponse, AthleteRequest>({
    mutationFn: async (data: AthleteRequest) => {
      const response = await api.post(COLLECTION_ATHLETES_ROUTE(), data)
      setAthletes(response.data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes", currentTournament?.id] })
    },
  })
}

export const useUpdateAthlete = () => {
  const { currentTournament } = useTournamentStore((state) => state)
  const queryClient = useQueryClient()

  return useMutation<AthleteResponse, ErrorResponse, AthleteRequest>({
    mutationFn: async (data: AthleteRequest) => {
      if (!data.id) {
        throw new Error("ID do atleta não encontrado")
      }
      const response = await api.put(MEMBER_ATHLETES_ROUTE(data.id), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes", currentTournament?.id] })
    },
  })
}

export const useDeleteAthlete = () => {
  const { currentTournament } = useTournamentStore((state) => state)
  const queryClient = useQueryClient()

  return useMutation<void, ErrorResponse, string>({
    mutationFn: async (id: string) => {
      await api.delete(MEMBER_ATHLETES_ROUTE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes", currentTournament?.id] })
    },
  })
}
