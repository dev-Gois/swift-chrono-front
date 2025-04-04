interface Tournament {
  id: string;
  name: string;
}

type TournamentResponse = Tournament

type TournamentRequest = {
  id: string;
  tournament: {
    name: string;
  }
}

export type { Tournament, TournamentResponse, TournamentRequest }