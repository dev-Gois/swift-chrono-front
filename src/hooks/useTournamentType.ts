export default function useTournamentType(tournament_type: "laps" | "sprint") {
  if (tournament_type === "laps") {
    return "Por voltas"
  }

  return "Sprint"
}