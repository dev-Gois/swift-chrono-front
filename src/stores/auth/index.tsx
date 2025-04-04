import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "@/hooks/axios"
import { AuthState } from "./types"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null })
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
        }
      },
    }
  )
)