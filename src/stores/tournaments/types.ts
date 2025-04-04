export interface TournamentState {
  tournaments: Tournament[] | null
  currentTournament: Tournament | null
  setCurrentTournament: (tournament: Tournament | null) => void
  setTournaments: (tournaments: Tournament[]) => void
}

export interface Tournament {
  id: string
  name: string
}