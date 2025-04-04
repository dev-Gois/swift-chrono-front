import { useTournamentStore } from "@/stores/tournaments"
import { useAuthStore } from "@/stores/auth"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { COLLECTION_TOURNAMENTS_ROUTE, MEMBER_TOURNAMENTS_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"
import { useToast } from "@/hooks/use-toast"
import { TournamentRequest, TournamentResponse } from "@/types/tournament"
import { ErrorResponse } from "@/types/request"

export const useFetchTournaments = () => {
  const setTournaments = useTournamentStore((state) => state.setTournaments)
  const { token } = useAuthStore()
  
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const response = await api.get(COLLECTION_TOURNAMENTS_ROUTE)
      setTournaments(response.data)
      return response.data
    },
    enabled: !!token
  })
}

export const useCreateTournament = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation<TournamentResponse, ErrorResponse, TournamentRequest>({
    mutationFn: async (data: TournamentRequest) => {
      const response = await api.post(COLLECTION_TOURNAMENTS_ROUTE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      toast({
        title: "Sucesso!",
        description: "Torneio criado com sucesso."
      })
    },
    onError: () => {
      toast({
        title: "Erro!",
        description: "Erro ao criar torneio.",
        variant: "destructive"
      })
    }
  })
}

export const useDeleteTournament = () => {
  const queryClient = useQueryClient()
  const setCurrentTournament = useTournamentStore((state) => state.setCurrentTournament)
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(MEMBER_TOURNAMENTS_ROUTE(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      setCurrentTournament(null)
    },
  })
}

export const useUpdateTournament = () => {
  const queryClient = useQueryClient()
  const setCurrentTournament = useTournamentStore((state) => state.setCurrentTournament)

  return useMutation<TournamentResponse, ErrorResponse, TournamentRequest>({
    mutationFn: async (data: TournamentRequest) => {
      const response = await api.put(MEMBER_TOURNAMENTS_ROUTE(data.id), data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      setCurrentTournament(data)
    },
  })
}