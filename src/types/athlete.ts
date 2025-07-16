interface Athlete {
  id: string
  name: string
  plate: string
  category_id: string
}

type AthleteResponse = Athlete

type AthleteRequest = {
  id?: string
  athlete: {
    name: string
    plate: string
    category_id: string
  }
}

export interface PagyMeta {
  count: number
  page: number
  outset: number
  limit: number
  offset: number
  last: number
  from: number
  to: number
  in: number
  prev?: number | null
  next?: number | null
  vars?: any
}

export interface AthletesPaginatedResponse {
  athletes: Athlete[]
  pagy: PagyMeta
}

export type { Athlete, AthleteResponse, AthleteRequest }
