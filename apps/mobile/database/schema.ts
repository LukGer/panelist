import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// RSS Feeds table
export const feeds = sqliteTable("feeds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  description: text("description"),
  siteUrl: text("site_url"),
  faviconUrl: text("favicon_url"),
  lastFetched: integer("last_fetched", { mode: "timestamp" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  feedId: integer("feed_id")
    .notNull()
    .references(() => feeds.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  link: text("link").notNull(),
  description: text("description"),
  content: text("content"),
  author: text("author"),
  guid: text("guid").notNull().unique(),
  pubDate: integer("pub_date", { mode: "timestamp" }),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  isBookmarked: integer("is_bookmarked", { mode: "boolean" })
    .notNull()
    .default(false),
  thumbnailUrl: text("thumbnail_url"),
  categories: text("categories"), // JSON string for multiple categories
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Export types for TypeScript
export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
