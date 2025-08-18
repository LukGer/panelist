import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const feeds = pgTable(
  "feeds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    siteUrl: text("site_url"),
    faviconUrl: text("favicon_url"),
    lastFetched: timestamp("last_fetched"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("feeds_url_idx").on(table.url)]
);

export const userFeeds = pgTable(
  "user_feeds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("user_feeds_user_id_idx").on(table.userId),
    index("user_feeds_feed_id_idx").on(table.feedId),
  ]
);

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    link: text("link").notNull(),
    description: text("description"),
    isDescriptionHtml: boolean("is_description_html").notNull().default(false),
    content: text("content"),
    author: text("author"),
    guid: text("guid").notNull(),
    pubDate: timestamp("pub_date"),
    isRead: boolean("is_read").notNull().default(false),
    isBookmarked: boolean("is_bookmarked").notNull().default(false),
    thumbnailUrl: text("thumbnail_url"),
    categories: jsonb("categories"), // JSON array for multiple categories
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("entries_feed_id_idx").on(table.feedId),
    index("entries_guid_idx").on(table.guid),
    index("entries_pub_date_idx").on(table.pubDate),
    index("entries_is_read_idx").on(table.isRead),
  ]
);

export const feedsRelations = relations(feeds, ({ many }) => ({
  userFeeds: many(userFeeds),
  entries: many(entries),
}));

export const userFeedsRelations = relations(userFeeds, ({ one }) => ({
  user: one(user, {
    fields: [userFeeds.userId],
    references: [user.id],
  }),
  feed: one(feeds, {
    fields: [userFeeds.feedId],
    references: [feeds.id],
  }),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  feed: one(feeds, {
    fields: [entries.feedId],
    references: [feeds.id],
  }),
}));

export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
export type UserFeed = typeof userFeeds.$inferSelect;
export type NewUserFeed = typeof userFeeds.$inferInsert;
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;

export type EntryWithFeed = Entry & { feed: Feed };
