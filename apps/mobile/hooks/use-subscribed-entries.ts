import { makeAuthenticatedRequest } from "@/auth/request";
import { useQuery } from "@tanstack/react-query";

export type SubscribedEntry = {
  id: string;
  feedId: string;
  title: string;
  link: string;
  description: string | null;
  isDescriptionHtml: boolean;
  summary: string | null;
  content: string | null;
  author: string | null;
  guid: string;
  pubDate: Date | null;
  isRead: boolean;
  isBookmarked: boolean;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  feed: {
    id: string;
    title: string;
    url: string;
    description: string | null;
    siteUrl: string | null;
    faviconUrl: string | null;
    lastFetched: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export const useSubscribedEntries = () => {
  const fetchSubscribedEntries = async (): Promise<SubscribedEntry[]> => {
    const response = await makeAuthenticatedRequest(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/rss/subscribed/entries`
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
