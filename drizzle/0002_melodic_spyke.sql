CREATE TABLE `bank_connections` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`account` text NOT NULL,
	`key_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bank_events` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`amount` integer NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL,
	`booking_id` text,
	`created_at` text NOT NULL
);
