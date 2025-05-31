export interface AthletesState {
  athletes: Athlete[]
  setAthletes: (athletes: Athlete[]) => void
}

interface Athlete {
  id: string
  name: string
  plate: string
  category_id: string
}
