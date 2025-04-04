import { create } from "zustand"
import { CategoriesState } from "./types"

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories: Array.isArray(categories) ? categories : [] }),
}))
