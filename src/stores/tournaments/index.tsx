import { create } from "zustand"
import { TournamentState } from "./types"

export const useTournamentStore = create<TournamentState>()((set) => ({
  tournaments: [],
  currentTournament: null,
  setCurrentTournament: (tournament) => set({ currentTournament: tournament }),
  setTournaments: (tournaments) => set({ tournaments })
}))