import { getDb } from "@/db/config";
import {
  categories,
  entries,
  entryCategories,
  feeds,
  userFeeds,
} from "@/db/schema";
import { authenticate, authenticateApiKey } from "@/middleware/auth-middleware";
import { withJob } from "@/middleware/job-middleware";
import { RssService } from "@/services/rss-service";
import { createApp } from "@/utils/createApp";
import { createRoute } from "@hono/zod-openapi";
import { env } from "cloudflare:workers";
import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";

const rssRouter = createApp();

const ErrorResponseSchema = z.object({
  error: z.string(),
});

const fetchAllRoute = createRoute({
  method: "post",
  path: "/fetch-all",
  security: [{ ApiKeyAuth: [] }],
  middleware: [authenticateApiKey, withJob({ jobName: "rss-fetch-all" })],
  responses: {
    200: {
      description: "Successfully fetched RSS feeds",
    },
    401: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Unauthorized - Invalid API key",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "No active feeds found",
    },
    409: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Job already running",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["RSS"],
  summary: "Fetch RSS entries for all active feeds",
  description:
    "Fetches RSS entries for all active feeds. Requires API key authentication. Prevents duplicate job runs.",
});

rssRouter.openapi(fetchAllRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const db = getDb(env);
  const activeFeeds = await db
    .select({
      id: feeds.id,
      url: feeds.url,
    })
    .from(feeds)
    .where(eq(feeds.isActive, true));

  if (activeFeeds.length === 0) {
    return c.json({ error: "No active feeds found" }, 404);
  }

  const rssService = new RssService();
  const newEntries = await rssService.fetchFeeds(activeFeeds);

  await db.insert(entries).values(newEntries);

  return c.json(
    { message: `Successfully processed ${activeFeeds.length} feeds.` },
    200
  );
});

const subscribedRoute = createRoute({
  method: "get",
  path: "/subscribed/entries",
  security: [{ BearerAuth: [] }],
  middleware: [authenticate],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              id: z.uuid(),
              feedId: z.uuid(),
              title: z.string(),
              link: z.string(),
              description: z.string().nullable(),
              isDescriptionHtml: z.boolean(),
              summary: z.string().nullable(),
              content: z.string().nullable(),
              author: z.string().nullable(),
              guid: z.string(),
              pubDate: z.date().nullable(),
              isRead: z.boolean(),
              isBookmarked: z.boolean(),
              thumbnailUrl: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              feed: z.object({
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
              }),
            })
          ),
        },
      },
      description: "Successfully fetched entries from user's subscribed feeds",
    },
    401: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Unauthorized - Invalid session",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["RSS"],
  summary: "Get entries from user's subscribed feeds",
  description:
    "Retrieves entries from all feeds that the authenticated user has subscribed to.",
});

rssRouter.openapi(subscribedRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = user.id;
  const db = getDb(env);

  const subscribedEntries = await db
    .select({
      id: entries.id,
      feedId: entries.feedId,
      title: entries.title,
      link: entries.link,
      description: entries.description,
      isDescriptionHtml: entries.isDescriptionHtml,
      summary: entries.summary,
      content: entries.content,
      author: entries.author,
      guid: entries.guid,
      pubDate: entries.pubDate,
      isRead: entries.isRead,
      isBookmarked: entries.isBookmarked,
      thumbnailUrl: entries.thumbnailUrl,
      createdAt: entries.createdAt,
      updatedAt: entries.updatedAt,
      feed: {
        id: feeds.id,
        title: feeds.title,
        url: feeds.url,
        description: feeds.description,
        siteUrl: feeds.siteUrl,
        faviconUrl: feeds.faviconUrl,
        lastFetched: feeds.lastFetched,
        isActive: feeds.isActive,
        createdAt: feeds.createdAt,
        updatedAt: feeds.updatedAt,
      },
    })
    .from(entries)
    .innerJoin(feeds, eq(entries.feedId, feeds.id))
    .innerJoin(userFeeds, eq(feeds.id, userFeeds.feedId))
    .where(eq(userFeeds.userId, userId))
    .orderBy(desc(entries.pubDate), desc(entries.createdAt));

  return c.json(subscribedEntries, 200);
});

const feedDetailsRoute = createRoute({
  method: "get",
  path: "/feeds/{feedId}",
  security: [{ BearerAuth: [] }],
  middleware: [authenticate],
  request: {
    params: z.object({
      feedId: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
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
                id: z.string(),
                title: z.string(),
                pubDate: z.date().nullable(),
                author: z.string().nullable(),
              })
              .nullable(),
            categories: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              })
            ),
          }),
        },
      },
      description: "Successfully fetched feed details",
    },
    401: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Unauthorized - Invalid session",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Feed not found",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["RSS"],
  summary: "Get detailed information about a specific RSS feed",
  description:
    "Retrieves detailed information about a specific RSS feed including subscriber count, entry count, latest entry, and categories.",
});

rssRouter.openapi(feedDetailsRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { feedId } = c.req.valid("param");
  const db = getDb(env);

  // Get basic feed info
  const feed = await db
    .select({
      id: feeds.id,
      title: feeds.title,
      url: feeds.url,
      description: feeds.description,
      siteUrl: feeds.siteUrl,
      faviconUrl: feeds.faviconUrl,
      lastFetched: feeds.lastFetched,
      isActive: feeds.isActive,
      createdAt: feeds.createdAt,
      updatedAt: feeds.updatedAt,
    })
    .from(feeds)
    .where(eq(feeds.id, feedId))
    .limit(1);

  if (feed.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }

  const feedData = feed[0]!;

  // Get entry count
  const entryCount = await db
    .select({ count: count() })
    .from(entries)
    .where(eq(entries.feedId, feedId));

  // Get subscriber count
  const subscriberCount = await db
    .select({ count: count() })
    .from(userFeeds)
    .where(eq(userFeeds.feedId, feedId));

  // Get latest entry
  const latestEntry = await db
    .select({
      id: entries.id,
      title: entries.title,
      pubDate: entries.pubDate,
      author: entries.author,
    })
    .from(entries)
    .where(eq(entries.feedId, feedId))
    .orderBy(desc(entries.pubDate))
    .limit(1);

  // Get categories
  const feedCategories = await db
    .selectDistinct({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .innerJoin(entryCategories, eq(entryCategories.categoryId, categories.id))
    .innerJoin(entries, eq(entries.id, entryCategories.entryId))
    .where(eq(entries.feedId, feedId));

  return c.json(
    {
      id: feedData.id,
      title: feedData.title,
      url: feedData.url,
      description: feedData.description,
      siteUrl: feedData.siteUrl,
      faviconUrl: feedData.faviconUrl,
      lastFetched: feedData.lastFetched,
      isActive: feedData.isActive,
      createdAt: feedData.createdAt,
      updatedAt: feedData.updatedAt,
      _count: {
        entries: Number(entryCount[0]?.count || 0),
        subscribers: Number(subscriberCount[0]?.count || 0),
      },
      latestEntry: latestEntry[0] || null,
      categories: feedCategories,
    },
    200
  );
});

export default rssRouter;
