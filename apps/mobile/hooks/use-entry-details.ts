import { makeAuthenticatedRequest } from "@/auth/request";
import { useQuery } from "@tanstack/react-query";

export interface EntryDetails {
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
  pubDate: string | null;
  isRead: boolean;
  isBookmarked: boolean;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  feed: {
    id: string;
    title: string;
    url: string;
    description: string | null;
    siteUrl: string | null;
    faviconUrl: string | null;
    lastFetched: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

const fetchEntryDetails = async (entryId: string): Promise<EntryDetails> => {
  console.log('fetchEntryDetails - entryId:', entryId);
  const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/rss/entries/${entryId}`;
  console.log('fetchEntryDetails - API URL:', apiUrl);

  const response = await makeAuthenticatedRequest(apiUrl);

  console.log('fetchEntryDetails - response status:', response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch entry details: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('fetchEntryDetails - response data:', data);
  return data;
};

export const useEntryDetails = (entryId: string) => {
  console.log('useEntryDetails - entryId:', entryId);
  return useQuery({
    queryKey: ["entry-details", entryId],
    queryFn: () => fetchEntryDetails(entryId),
    enabled: !!entryId && entryId !== "undefined" && entryId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
