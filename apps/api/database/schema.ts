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

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

export const feeds = pgTable(
  "feeds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
  (table) => ({
    userIdIdx: index("feeds_user_id_idx").on(table.userId),
    urlIdx: index("feeds_url_idx").on(table.url),
  })
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
  (table) => ({
    feedIdIdx: index("entries_feed_id_idx").on(table.feedId),
    guidIdx: index("entries_guid_idx").on(table.guid),
    pubDateIdx: index("entries_pub_date_idx").on(table.pubDate),
    isReadIdx: index("entries_is_read_idx").on(table.isRead),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  feeds: many(feeds),
}));

export const feedsRelations = relations(feeds, ({ one, many }) => ({
  user: one(users, {
    fields: [feeds.userId],
    references: [users.id],
  }),
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  feed: one(feeds, {
    fields: [entries.feedId],
    references: [feeds.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
