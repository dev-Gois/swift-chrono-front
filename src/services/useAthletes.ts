import { useAthletesStore } from "@/stores/athletes"
import { useTournamentStore } from "@/stores/tournaments"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { COLLECTION_ATHLETES_ROUTE, MEMBER_ATHLETES_ROUTE, IMPORT_ATHLETES_CSV_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"
import { AthleteRequest, AthleteResponse, AthletesPaginatedResponse } from "@/types/athlete"
import { ErrorResponse } from "@/types/request"

export const useFetchAthletes = (page: number = 1, items: number = 10) => {
  const setAthletes = useAthletesStore((state) => state.setAthletes)
  const { currentTournament } = useTournamentStore((state) => state)
  const tournamentId = currentTournament?.id

  return useQuery<AthletesPaginatedResponse>({
    queryKey: ["athletes", tournamentId, page, items],
    queryFn: async () => {
      const response = await api.get(
        `${COLLECTION_ATHLETES_ROUTE(tournamentId as string)}?page=${page}&limit=${items}`
      )
      setAthletes(response.data.athletes)
      return response.data
    },
    enabled: !!tournamentId,
  })
}

export const useCreateAthlete = () => {
  const setAthletes = useAthletesStore((state) => state.setAthletes)
  const queryClient = useQueryClient()
  const { currentTournament } = useTournamentStore((state) => state)

  return useMutation<AthleteResponse, ErrorResponse, AthleteRequest>({
    mutationFn: async (data: AthleteRequest) => {
      if (!currentTournament) {
        throw new Error("Torneio não selecionado")
      }
      const response = await api.post(COLLECTION_ATHLETES_ROUTE(currentTournament.id), data)
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
      if (!currentTournament) {
        throw new Error("Torneio não selecionado")
      }
      if (!data.id) {
        throw new Error("ID do atleta não encontrado")
      }
      const response = await api.put(MEMBER_ATHLETES_ROUTE(currentTournament.id, data.id), data)
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
      if (!currentTournament) {
        throw new Error("Torneio não selecionado")
      }
      await api.delete(MEMBER_ATHLETES_ROUTE(currentTournament.id, id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes", currentTournament?.id] })
    },
  })
}

export const useImportAthletesCSV = () => {
  const { currentTournament } = useTournamentStore((state) => state)
  const queryClient = useQueryClient()

  return useMutation<void, ErrorResponse, File>({
    mutationFn: async (file: File) => {
      if (!currentTournament) {
        throw new Error("Torneio não selecionado")
      }
      
      const formData = new FormData()
      formData.append("file", file)
      
      await api.post(IMPORT_ATHLETES_CSV_ROUTE(currentTournament.id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes", currentTournament?.id] })
    },
  })
}
