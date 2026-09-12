interface Tournament {
  id: string;
  name: string;
  tournament_type: "sprint" | "laps";
  race_day_mode: boolean;
  started_at?: string | null;
  finished_at?: string | null;
}

type TournamentResponse = Tournament

type TournamentRequest = {
  id: string;
  tournament: {
    name?: string;
    race_day_mode?: boolean;
  }
}

export type { Tournament, TournamentResponse, TournamentRequest }
