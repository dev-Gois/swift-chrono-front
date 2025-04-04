export interface AuthState {
  user: any | null
  token: string | null
  setUser: (user: any) => void
  setToken: (token: string) => void
  logout: () => void
}