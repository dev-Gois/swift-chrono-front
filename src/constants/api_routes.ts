export const BASE_URL = 'http://localhost:3000';

export const LOGIN_ROUTE = '/login';

export const COLLECTION_TOURNAMENTS_ROUTE = '/tournaments';

export const MEMBER_TOURNAMENTS_ROUTE = (id: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${id}`;

export const COLLECTION_CATEGORIES_ROUTE = (tournamentId: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${tournamentId}/categories`;

export const MEMBER_CATEGORIES_ROUTE = (tournamentId: string, categoryId: string) => `${COLLECTION_CATEGORIES_ROUTE(tournamentId)}/${categoryId}`;

export const IMPORT_CATEGORIES_CSV_ROUTE = (tournamentId: string) => `${COLLECTION_CATEGORIES_ROUTE(tournamentId)}/import_csv`;

export const COLLECTION_ATHLETES_ROUTE = (tournamentId: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${tournamentId}/athletes`;

export const MEMBER_ATHLETES_ROUTE = (tournamentId: string, athleteId: string) => `${COLLECTION_ATHLETES_ROUTE(tournamentId)}/${athleteId}`;

export const IMPORT_ATHLETES_CSV_ROUTE = (tournamentId: string) => `${COLLECTION_ATHLETES_ROUTE(tournamentId)}/import_csv`;

export const START_TOURNAMENT_ROUTE = (tournamentId: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${tournamentId}/start`;

export const FINISH_TOURNAMENT_ROUTE = (tournamentId: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${tournamentId}/finish`;

export const RESET_TOURNAMENT_ROUTE = (tournamentId: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${tournamentId}/reset`;

export const COLLECTION_ATHLETE_LAPS_ROUTE = (tournamentId: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${tournamentId}/athlete_laps`;

export const LAST_FIVE_LAPS_ROUTE = (tournamentId: string) => `${COLLECTION_ATHLETE_LAPS_ROUTE(tournamentId)}/last_five_laps`;

export const MEMBER_ATHLETE_LAPS_ROUTE = (tournamentId: string, athleteLapId: string) => `${COLLECTION_ATHLETE_LAPS_ROUTE(tournamentId)}/${athleteLapId}`;

export const RANKING_ROUTE = (categoryId: string) => `/ranking/${categoryId}`;