import { create } from "zustand"
import { GeneralState } from "./types"

export const useGeneralStore = create<GeneralState>((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
}))