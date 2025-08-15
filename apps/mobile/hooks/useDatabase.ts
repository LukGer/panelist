import { useQuery } from "@tanstack/react-query";
import { initializeDatabase } from "../database";

export function useDatabase() {
  return useQuery({
    queryKey: ["db", "init"],
    queryFn: async () => {
      await initializeDatabase();
      return true;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 3,
  });
}
