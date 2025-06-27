import { useCategoriesStore } from "@/stores/categories"
import { useTournamentStore } from "@/stores/tournaments"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { COLLECTION_CATEGORIES_ROUTE, MEMBER_CATEGORIES_ROUTE, IMPORT_CATEGORIES_CSV_ROUTE } from "@/constants/api_routes"
import { api } from "@/hooks/axios"
import { CategoryRequest, CategoryResponse } from "@/types/category"
import { ErrorResponse } from "@/types/request"

export const useFetchCategories = () => {
  const setCategories = useCategoriesStore((state) => state.setCategories)
  const { currentTournament } = useTournamentStore((state) => state)

  if (!currentTournament) {
    return {
      data: [],
      isLoading: false,
      error: null,
    }
  }
  
  return useQuery({
    queryKey: ["categories", currentTournament?.id],
    queryFn: async () => {
      const response = await api.get(COLLECTION_CATEGORIES_ROUTE(currentTournament?.id))
      setCategories(response.data)
      return response.data
    },
  })
}

export const useCreateCategory = () => {
  const { currentTournament } = useTournamentStore((state) => state)
  const setCategories = useCategoriesStore((state) => state.setCategories)
  const queryClient = useQueryClient()

  return useMutation<CategoryResponse, ErrorResponse, Omit<CategoryRequest, "id">>({
    mutationFn: async (category: Omit<CategoryRequest, "id">) => {
      if (!currentTournament) {
        throw new Error("Torneio não encontrado")
      }
      const response = await api.post(COLLECTION_CATEGORIES_ROUTE(currentTournament?.id), category)
      setCategories(response.data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", currentTournament?.id] })
    },
  })
}

export const useUpdateCategory = () => {
  const { currentTournament } = useTournamentStore((state) => state)
  const queryClient = useQueryClient()

  return useMutation<CategoryResponse, ErrorResponse, CategoryRequest>({
    mutationFn: async ({ id, category }) => {
      if (!currentTournament) {
        throw new Error("Torneio não encontrado")
      }
      
      const response = await api.put(MEMBER_CATEGORIES_ROUTE(currentTournament.id, id), category)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", currentTournament?.id] })
    },
  })
}

export const useDeleteCategory = () => {
  const { currentTournament } = useTournamentStore((state) => state)
  const queryClient = useQueryClient()

  return useMutation<void, ErrorResponse, string>({
    mutationFn: async (id: string) => {
      if (!currentTournament) {
        throw new Error("Torneio não encontrado")
      }
      if (!id) {
        throw new Error("ID da categoria não encontrado")
      }
      await api.delete(MEMBER_CATEGORIES_ROUTE(currentTournament.id, id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", currentTournament?.id] })
    },
  })
}

export const useImportCategoriesCSV = () => {
  const { currentTournament } = useTournamentStore((state) => state)
  const queryClient = useQueryClient()

  return useMutation<void, ErrorResponse, File>({
    mutationFn: async (file: File) => {
      if (!currentTournament) {
        throw new Error("Torneio não selecionado")
      }
      
      const formData = new FormData()
      formData.append("file", file)
      
      await api.post(IMPORT_CATEGORIES_CSV_ROUTE(currentTournament.id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", currentTournament?.id] })
    },
  })
}