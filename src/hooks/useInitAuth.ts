import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth"
import { api } from "@/hooks/axios"

export const useInitAuth = () => {
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }, [token])
}