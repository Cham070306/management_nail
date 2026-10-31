CREATE TABLE `invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`employee_index` integer,
	`token_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`accepted_at` text
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`employee_index` integer,
	`created_at` text NOT NULL
);
