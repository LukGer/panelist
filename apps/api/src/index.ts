import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../database/config";
import { entries, feeds, userFeeds } from "../database/schema";
import { auth } from "./auth";
import { authenticate } from "./middleware";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use("*", authenticate);

app.get("/api/entries/subscribed", authenticate, async (c) => {
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  try {
    const userId = user.id;

    const subscribedEntries = await db
      .select({
        id: entries.id,
        title: entries.title,
        link: entries.link,
        description: entries.description,
        isDescriptionHtml: entries.isDescriptionHtml,
        content: entries.content,
        author: entries.author,
        guid: entries.guid,
        pubDate: entries.pubDate,
        isRead: entries.isRead,
        isBookmarked: entries.isBookmarked,
        thumbnailUrl: entries.thumbnailUrl,
        categories: entries.categories,
        createdAt: entries.createdAt,
        updatedAt: entries.updatedAt,
        feed: {
          id: feeds.id,
          title: feeds.title,
          url: feeds.url,
          description: feeds.description,
          siteUrl: feeds.siteUrl,
          faviconUrl: feeds.faviconUrl,
        },
      })
      .from(entries)
      .innerJoin(feeds, eq(entries.feedId, feeds.id))
      .innerJoin(userFeeds, eq(feeds.id, userFeeds.feedId))
      .where(and(eq(userFeeds.userId, userId), eq(feeds.isActive, true)))
      .orderBy(desc(entries.pubDate))
      .limit(50);

    console.log(subscribedEntries);

    return c.json({
      entries: subscribedEntries,
      count: subscribedEntries.length,
    });
  } catch (error) {
    console.error("Error fetching subscribed entries:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
