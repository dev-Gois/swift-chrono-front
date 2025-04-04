import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth"
import { api } from "@/hooks/axios"
import { LOGIN_ROUTE } from "@/constants/api_routes"

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (data: { name: string; password: string }) => {
      try {
        const response = await api.post(LOGIN_ROUTE, { user: data });
        return response.data;
      } catch (error) {
        console.error("Erro na API:", error);
        throw new Error("Falha no login");
      }
    },
    onSuccess: ({ user, token }) => {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setToken(token);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: async () => {
      api.defaults.headers.common["Authorization"] = ""
      logout()
    },
  })
}