import { useTournamentStore } from "@/stores/tournaments"
import { useAuthStore } from "@/stores/auth"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { COLLECTION_TOURNAMENTS_ROUTE, FINISH_TOURNAMENT_ROUTE, MEMBER_TOURNAMENTS_ROUTE, RESET_TOURNAMENT_ROUTE, START_TOURNAMENT_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"
import { toast, useToast } from "@/hooks/use-toast"
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

export const useFetchTournament = (id: string) => {
  const { token } = useAuthStore()
  return useQuery({
    queryKey: ["tournament", id],
    queryFn: async () => {
      const response = await api.get(MEMBER_TOURNAMENTS_ROUTE(id))
      return response.data
    },
    enabled: !!token && !!id
  })
}

export const useCreateTournament = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation<TournamentResponse, ErrorResponse, Omit<TournamentRequest, "id">>({
    mutationFn: async (data: Omit<TournamentRequest, "id">) => {
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

export const useStartTournament = () => {
  const queryClient = useQueryClient()
  const { currentTournament } = useTournamentStore()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(START_TOURNAMENT_ROUTE(currentTournament?.id as string))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament", currentTournament?.id] })
      toast({
        title: "Sucesso!",
        description: "Torneio iniciado com sucesso."
      })
    },
    onError: () => {
      toast({
        title: "Erro!",
        description: "Erro ao iniciar torneio.",
        variant: "destructive"
      })
    }
  })
}

export const useFinishTournament = () => {
  const queryClient = useQueryClient()
  const { currentTournament } = useTournamentStore()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(FINISH_TOURNAMENT_ROUTE(currentTournament?.id as string))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament", currentTournament?.id] })
      toast({
        title: "Sucesso!",
        description: "Torneio finalizado com sucesso."
      })
    },
    onError: () => {
      toast({
        title: "Erro!",
        description: "Erro ao finalizar torneio.",
        variant: "destructive"
      })
    }
  })
}

export const useResetTournament = () => {
  const queryClient = useQueryClient()
  const { currentTournament } = useTournamentStore()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(RESET_TOURNAMENT_ROUTE(currentTournament?.id as string))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament", currentTournament?.id] })
      queryClient.invalidateQueries({ queryKey: ["tournament"] })
      queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["athlete_laps"] })
      queryClient.invalidateQueries({ queryKey: ["last_five_laps"] })
      queryClient.invalidateQueries({ queryKey: ["ranking"] })
      toast({
        title: "Sucesso!",
        description: "Torneio resetado com sucesso."
      })
    },
    onError: () => {
      toast({
        title: "Erro!",
        description: "Erro ao resetar torneio.",
        variant: "destructive"
      })
    }
  })
}