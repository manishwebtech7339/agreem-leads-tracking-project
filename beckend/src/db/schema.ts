import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defineRelations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  gender: text().notNull(),
  password: text().notNull(),
  salt: text().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Leads schema for the leads related to users
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull(),
  phone: text().default(""),
  status: text().notNull(), //  (new, contacted, qualified, lost)
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  // Reactions
  userId: int("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // cascade: When a user is deleted, all their associated leads will also be deleted automatically.
});

// Notes schema for the leads
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  // Reactions
  userId: int("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  leadId: int("leadId")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
});

// Relations
export const relationsSchema = defineRelations(
  {
    users,
    leads,
    notes,
  },
  (r) => ({
    // User schema relations // One to Many
    user: {
      leads: r.many.leads(),
      notes: r.many.notes(),
    },

    // Leads schema relations // One to Many
    leads: {
      user: r.one.users({
        from: r.leads.userId,
        to: r.users.id,
      }),

      notes: r.many.notes(),
    },

    // Notes schema relations // One to One
    notes: {
      user: r.one.users({
        from: r.notes.userId,
        to: r.users.id,
      }),

      lead: r.one.leads({
        from: r.notes.leadId,
        to: r.leads.id,
      }),
    },
  }),
);
