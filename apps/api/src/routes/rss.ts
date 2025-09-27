import { db } from "@/db/config";
import {
  categories,
  entries,
  entryCategories,
  feeds,
  userFeeds,
} from "@/db/schema";
import {
  EmptySuccessResponse,
  InternalServerErrorResponse,
  JobAlreadyRunningResponse,
  NotFoundResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/features/general/response/general.schema";
import { EntryIdRequestParamsSchema } from "@/features/rss/request/entry-id.schema";
import { FeedIdRequestParamsSchema } from "@/features/rss/request/feed-id.schema";
import { EntryDetailsResponseSchema } from "@/features/rss/response/entry-details.schema";
import { FeedDetailsResponseSchema } from "@/features/rss/response/feed-details.schema";
import { SubscribedEntriesResponseSchema } from "@/features/rss/response/subscribed-entries.schema";
import createApp from "@/lib/createApp";
import { authenticate, authenticateApiKey } from "@/middleware/auth-middleware";
import { withJob } from "@/middleware/job-middleware";
import { RssService } from "@/services/rss-service";
import { createRoute } from "@hono/zod-openapi";
import { and, count, desc, eq } from "drizzle-orm";

const rssRouter = createApp();

const fetchAllRoute = createRoute({
  method: "post",
  path: "/fetch-all",
  security: [{ ApiKeyAuth: [] }],
  middleware: [authenticateApiKey, withJob({ jobName: "rss-fetch-all" })],
  responses: {
    200: EmptySuccessResponse,
    401: UnauthorizedResponse,
    404: NotFoundResponse,
    409: JobAlreadyRunningResponse,
    500: InternalServerErrorResponse,
  },
  summary: "Fetch RSS entries for all active feeds",
});

rssRouter.openapi(fetchAllRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

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

  try {
    const rssService = new RssService();
    const newEntries = await rssService.fetchFeeds(activeFeeds);
    await db.insert(entries).values(newEntries);
  } catch (err) {
    console.error(err);
    return c.json(
      {
        error: "Failed to fetch feeds",
        message: (err as unknown as Error).message,
      },
      500
    );
  }

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
    200: SuccessResponse(SubscribedEntriesResponseSchema),
    401: UnauthorizedResponse,
    500: InternalServerErrorResponse,
  },
  summary: "Get entries from user's subscribed feeds",
});

rssRouter.openapi(subscribedRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = user.id;

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
    params: FeedIdRequestParamsSchema,
  },
  responses: {
    200: SuccessResponse(FeedDetailsResponseSchema),
    401: UnauthorizedResponse,
    404: NotFoundResponse,
    500: InternalServerErrorResponse,
  },
  summary: "Get detailed information about a specific RSS feed",
});

rssRouter.openapi(feedDetailsRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { feedId } = c.req.valid("param");

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

  const entryCount = await db
    .select({ count: count() })
    .from(entries)
    .where(eq(entries.feedId, feedId));

  const subscriberCount = await db
    .select({ count: count() })
    .from(userFeeds)
    .where(eq(userFeeds.feedId, feedId));

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

const entryDetailsRoute = createRoute({
  method: "get",
  path: "/entries/{entryId}",
  security: [{ BearerAuth: [] }],
  middleware: [authenticate],
  request: {
    params: EntryIdRequestParamsSchema,
  },
  responses: {
    200: SuccessResponse(EntryDetailsResponseSchema),
    401: UnauthorizedResponse,
    404: NotFoundResponse,
    500: InternalServerErrorResponse,
  },
  summary: "Get detailed information about a specific entry",
});

rssRouter.openapi(entryDetailsRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { entryId } = c.req.valid("param");

  const entryData = await db
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
    .where(and(eq(entries.id, entryId), eq(userFeeds.userId, user.id)))
    .limit(1);

  if (entryData.length === 0) {
    return c.json({ error: "Entry not found" }, 404);
  }

  return c.json(entryData[0], 200);
});

export default rssRouter;
