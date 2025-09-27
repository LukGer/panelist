import z from "zod";

export const FeedDetailsResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  url: z.string(),
  description: z.string().nullable(),
  siteUrl: z.string().nullable(),
  faviconUrl: z.string().nullable(),
  lastFetched: z.date().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    entries: z.number(),
    subscribers: z.number(),
  }),
  latestEntry: z
    .object({
      id: z.uuid(),
      title: z.string(),
      pubDate: z.date().nullable(),
      author: z.string().nullable(),
    })
    .nullable(),
  categories: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
    })
  ),
});
