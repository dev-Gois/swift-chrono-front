interface Category {
  id: string;
  name: string;
  tournament_id: string;
}

type CategoryResponse = Category

type CategoryRequest = {
  id: string;
  category: {
    name: string;
    laps: number;
  }
}

export type { Category, CategoryResponse, CategoryRequest }