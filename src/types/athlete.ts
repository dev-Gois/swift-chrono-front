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

export type { Athlete, AthleteResponse, AthleteRequest }
