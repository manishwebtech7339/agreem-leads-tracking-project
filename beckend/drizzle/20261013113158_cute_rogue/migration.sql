CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`status` text NOT NULL,
	`createdAt` timestamp DEFAULT now() NOT NULL,
	`updatedAt` timestamp DEFAULT now() NOT NULL,
	`user_id` integer NOT NULL,
	CONSTRAINT `fk_leads_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` timestamp DEFAULT now() NOT NULL,
	`updatedAt` timestamp DEFAULT now() NOT NULL,
	`user_id` integer NOT NULL,
	`lead_id` integer NOT NULL,
	CONSTRAINT `fk_notes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_notes_lead_id_leads_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`gender` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`createdAt` timestamp DEFAULT now() NOT NULL,
	`updatedAt` timestamp DEFAULT now() NOT NULL
);
