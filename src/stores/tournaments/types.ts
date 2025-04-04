export interface TournamentState {
  tournaments: any[] | null
  currentTournament: any | null
  setCurrentTournament: (tournament: any) => void
  setTournaments: (tournaments: any[]) => void
}