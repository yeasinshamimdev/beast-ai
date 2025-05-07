import { useQuery } from "@tanstack/react-query";
import { useModelStore } from "@/store/useModelStore";
import { api } from "./api";

export const useFetchModels = ({ isModalOpen }: { isModalOpen: boolean }) => {
  const setModels = useModelStore((s) => s.setModels);

  return useQuery({
    queryKey: ["ai-models"],
    queryFn: async () => {
      const response = await api.get(`/ai/models/list`);
      setModels(response?.data?.models);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
    enabled: !!isModalOpen,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useFetchSingleModel = ({
  modelId,
  isAINode,
}: {
  modelId: string;
  isAINode: boolean;
}) => {
  const setSingleModel = useModelStore((s) => s.setSingleModel);
  return useQuery({
    queryKey: ["ai-model", modelId],
    queryFn: async () => {
      const response = await api.get(`/ai/models/read/${modelId}`);
      setSingleModel(response?.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!modelId && !!isAINode,
  });
};
