import { makeAuthenticatedRequest } from "@/auth/request";
import { useQuery } from "@tanstack/react-query";
import type { EntryWithFeed } from "api/database";

export type SubscribedEntry = EntryWithFeed;

interface SubscribedEntriesResponse {
  entries: SubscribedEntry[];
  count: number;
}

export const useSubscribedEntries = () => {
  const fetchSubscribedEntries =
    async (): Promise<SubscribedEntriesResponse> => {
      const response = await makeAuthenticatedRequest(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/entries/subscribed`
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    };

  return useQuery({
    queryKey: ["entries", "list"],
    queryFn: fetchSubscribedEntries,
  });
};
