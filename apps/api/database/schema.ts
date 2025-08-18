import { relations } from "drizzle-orm";
import {
  boolean,
  index,
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

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("categories_name_idx").on(table.name)]
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
    summary: text("summary"),
    content: text("content"),
    author: text("author"),
    guid: text("guid").notNull(),
    pubDate: timestamp("pub_date"),
    isRead: boolean("is_read").notNull().default(false),
    isBookmarked: boolean("is_bookmarked").notNull().default(false),
    thumbnailUrl: text("thumbnail_url"),
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

export const entryCategories = pgTable(
  "entry_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entryId: uuid("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("entry_categories_entry_id_idx").on(table.entryId),
    index("entry_categories_category_id_idx").on(table.categoryId),
  ]
);

export const jobLog = pgTable(
  "job_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobName: text("job_name").notNull(),
    status: text("status").notNull(), // 'running', 'completed', 'failed', 'cancelled'
    startedAt: timestamp("started_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    duration: text("duration"),
    message: text("message"),
  },
  (table) => [
    index("job_log_job_name_idx").on(table.jobName),
    index("job_log_status_idx").on(table.status),
    index("job_log_started_at_idx").on(table.startedAt),
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

export const entriesRelations = relations(entries, ({ one, many }) => ({
  feed: one(feeds, {
    fields: [entries.feedId],
    references: [feeds.id],
  }),
  entryCategories: many(entryCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  entryCategories: many(entryCategories),
}));

export const entryCategoriesRelations = relations(
  entryCategories,
  ({ one }) => ({
    entry: one(entries, {
      fields: [entryCategories.entryId],
      references: [entries.id],
    }),
    category: one(categories, {
      fields: [entryCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
export type UserFeed = typeof userFeeds.$inferSelect;
export type NewUserFeed = typeof userFeeds.$inferInsert;
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type EntryCategory = typeof entryCategories.$inferSelect;
export type NewEntryCategory = typeof entryCategories.$inferInsert;
export type JobLog = typeof jobLog.$inferSelect;
export type NewJobLog = typeof jobLog.$inferInsert;

export type EntryWithFeed = Entry & { feed: Feed };
