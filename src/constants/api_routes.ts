export const BASE_URL = 'http://localhost:3000';

export const LOGIN_ROUTE = '/login';

export const COLLECTION_TOURNAMENTS_ROUTE = '/tournaments';

export const MEMBER_TOURNAMENTS_ROUTE = (id: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${id}`;

export const COLLECTION_CATEGORIES_ROUTE = (tournamentId: string) => `${COLLECTION_TOURNAMENTS_ROUTE}/${tournamentId}/categories`;

export const MEMBER_CATEGORIES_ROUTE = (tournamentId: string, categoryId: string) => `${COLLECTION_CATEGORIES_ROUTE(tournamentId)}/${categoryId}`;