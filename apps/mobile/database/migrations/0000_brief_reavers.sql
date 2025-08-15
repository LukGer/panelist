CREATE TABLE `entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`feed_id` integer NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`description` text,
	`content` text,
	`author` text,
	`guid` text NOT NULL,
	`pub_date` integer,
	`is_read` integer DEFAULT false NOT NULL,
	`is_bookmarked` integer DEFAULT false NOT NULL,
	`thumbnail_url` text,
	`categories` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `feeds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entries_guid_unique` ON `entries` (`guid`);--> statement-breakpoint
CREATE TABLE `feeds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`site_url` text,
	`favicon_url` text,
	`last_fetched` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feeds_url_unique` ON `feeds` (`url`);