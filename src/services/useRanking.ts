import { useQuery } from "@tanstack/react-query";
import { RANKING_ROUTE } from "@/constants/api_routes";
import { api } from "@/hooks/axios";

export const useFetchRanking = (categoryId: string) => {
  return useQuery({
    queryKey: ["ranking", categoryId],
    queryFn: () => api.get(RANKING_ROUTE(categoryId)).then((res) => res.data),
  });
};

export const downloadRankingPdf = async (categoryId: string) => {
  const response = await api.get(`/ranking/${categoryId}/export_pdf`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `ranking_${categoryId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};