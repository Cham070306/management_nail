CREATE TABLE `booking_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `booking_pages` (
	`slug` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`settings` text NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `booking_pages_owner_id_unique` ON `booking_pages` (`owner_id`);