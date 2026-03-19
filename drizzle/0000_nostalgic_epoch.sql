CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`is_verified` integer DEFAULT false,
	`verification_token` text,
	`reset_token` text,
	`role` text DEFAULT 'wizard',
	`created_at` text DEFAULT '2026-03-19T17:48:27.932Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);