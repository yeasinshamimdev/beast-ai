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

// // Constants
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const MODELS_STALE_TIME = 5 * 60 * 1000;  // 5 minutes

// /**
//  * Options for the useFetchModels hook
//  */
// interface UseFetchModelsOptions {
//   enabled?: boolean;
//   queryOptions?: Partial<UseQueryOptions<Model[], Error>>;
// }

// /**
//  * Fetches AI models from the API
//  */
// const fetchModels = async (): Promise<Model[]> => {

//   try {
//     const response = await axios.get<Model[]>(`${BASE_URL}/ai/models/list`);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // Handle specific error cases with user-friendly messages
//       if (error.response?.status === 403) {
//         throw new Error('You do not have permission to access these models');
//       } else if (error.response?.status === 429) {
//         throw new Error('Rate limit exceeded. Please try again later');
//       } else if (error.response?.status === 404) {
//         throw new Error('Models endpoint not found');
//       } else if (error?.response?.status !== undefined && error.response.status >= 500) {
//         throw new Error('Server error. Please try again later');
//       } else if (error.code === 'ECONNABORTED') {
//         throw new Error('Request timed out. Please check your connection');
//       } else if (!error.response && error.request) {
//         throw new Error('Network error. Please check your connection');
//       }

//       // Generic error message with details when available
//       const errorMessage = error.response?.data?.message || error.message;
//       throw new Error(`Failed to fetch models: ${errorMessage}`);
//     }

//     // Handle non-axios errors
//     throw error instanceof Error
//       ? error
//       : new Error('An unknown error occurred while fetching models');
//   }
// };

// /**
//  * Custom hook for fetching AI models with proper error handling
//  */
// export const useFetchModels = ({
//   enabled = true,
//   queryOptions = {}
// }: UseFetchModelsOptions = {}) => {
//   return useQuery<Model[], Error>({
//     queryKey: ['ai-models'],
//     queryFn: fetchModels,
//     staleTime: MODELS_STALE_TIME,
//     refetchOnWindowFocus: false,
//     retry: (failureCount, error) => {
//       // Don't retry client errors (4xx)
//       if (axios.isAxiosError(error) &&
//           error.response?.status &&
//           error.response.status >= 400 &&
//           error.response.status < 500) {
//         return false;
//       }

//       // Retry server errors and network issues up to 2 times
//       return failureCount < 1;
//     },
//     enabled,
//     onSuccess: (data) => {
//         setModels(data); // ✅ Sync to global state
//         queryOptions?.onSuccess?.(data); // allow hook consumer’s own callback
//       },
//     ...queryOptions,
//   });
// };
