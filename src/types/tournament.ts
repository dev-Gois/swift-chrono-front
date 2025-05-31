interface Tournament {
  id: string;
  name: string;
  tournament_type: "sprint" | "laps";
}

type TournamentResponse = Tournament

type TournamentRequest = {
  id: string;
  tournament: {
    name: string;
    tournament_type: "sprint" | "laps";
  }
}

export type { Tournament, TournamentResponse, TournamentRequest }