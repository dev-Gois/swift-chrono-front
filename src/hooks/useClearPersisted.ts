import { useAthletesStore } from "@/stores/athletes"
import { useCategoriesStore } from "@/stores/categories"
import { useTournamentStore } from "@/stores/tournaments"

export const useClearPersisted = () => {
  const persistKeys = [
    'auth-storage',
    'tournament-storage',
  ]

  persistKeys.forEach(key => {
    localStorage.removeItem(key)
  })

  useAthletesStore.setState({ athletes: [] })
  useCategoriesStore.setState({ categories: [] })
  useTournamentStore.setState({ tournaments: [], currentTournament: null })
}
