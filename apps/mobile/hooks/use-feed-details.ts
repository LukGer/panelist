import { makeAuthenticatedRequest } from "@/auth/request";
import { useQuery } from "@tanstack/react-query";
import type { Feed } from "api/database";

export interface FeedDetails extends Feed {
  _count: {
    entries: number;
    subscribers: number;
  };
  latestEntry: {
    id: string;
    title: string;
    pubDate: string | null;
    author: string | null;
  } | null;
  categories: {
    id: string;
    name: string;
  }[];
}

const fetchFeedDetails = async (feedId: string): Promise<FeedDetails> => {
  const response = await makeAuthenticatedRequest(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/rss/feeds/${feedId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch feed details: ${response.statusText}`);
  }

  return response.json();
};

export const useFeedDetails = (feedId: string) => {
  return useQuery({
    queryKey: ["feed-details", feedId],
    queryFn: () => fetchFeedDetails(feedId),
    enabled: !!feedId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
