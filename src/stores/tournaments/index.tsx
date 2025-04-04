import { create } from "zustand"
import { persist } from "zustand/middleware"
import { TournamentState } from "./types"

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set) => ({
      tournaments: [],
      currentTournament: null,
      setCurrentTournament: (tournament) => set({ currentTournament: tournament }),
      setTournaments: (tournaments) => set({ tournaments })
    }),
    {
      name: "tournament-storage",
      partialize: (state) => ({ currentTournament: state.currentTournament })
    }
  )
)