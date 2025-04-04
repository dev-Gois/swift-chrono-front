interface Category {
  id: string;
  name: string;
  tournament_id: string;
}

type CategoryResponse = Category

type CategoryRequest = {
  id?: string;
  category: {
    name: string;
  }
}

export type { Category, CategoryResponse, CategoryRequest }