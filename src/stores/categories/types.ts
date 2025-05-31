export interface CategoriesState {
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

interface Category {
  id: string
  name: string
  tournament_id: string
}
