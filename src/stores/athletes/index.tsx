import { create } from "zustand"
import { AthletesState } from "./types"

export const useAthletesStore = create<AthletesState>((set) => ({
  athletes: [],
  setAthletes: (athletes) => set({ athletes: Array.isArray(athletes) ? athletes : [] }),
}))
