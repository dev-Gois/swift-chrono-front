import { useTournamentStore } from "@/stores/tournaments"
import { useAuthStore } from "@/stores/auth"
import { useQuery } from "@tanstack/react-query"
import { GET_TOURNAMENTS_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"

export const useFetchTournaments = () => {
  const setTournaments = useTournamentStore((state) => state.setTournaments)
  const { token } = useAuthStore()
  
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const response = await api.get(GET_TOURNAMENTS_ROUTE)
      setTournaments(response.data)
      return response.data
    },
    enabled: !!token
  })
}