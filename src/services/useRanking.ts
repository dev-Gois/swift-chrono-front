import { useQuery } from "@tanstack/react-query";
import { RANKING_ROUTE } from "@/constants/api_routes";
import { api } from "@/hooks/axios";

export const useFetchRanking = (categoryId: string) => {
  return useQuery({
    queryKey: ["ranking", categoryId],
    queryFn: () => api.get(RANKING_ROUTE(categoryId)).then((res) => res.data),
  });
};