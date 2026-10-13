import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defineRelations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const userDBSchema = sqliteTable("users", {
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
export const leadsDBSchema = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text(),
  phone: text(),
  status: text().notNull(), //  (new, contacted, qualified, lost)
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  // Reactions
  user_id: int("user_id")
    .notNull()
    .references(() => userDBSchema.id, { onDelete: "cascade" }), // cascade: When a user is deleted, all their associated leads will also be deleted automatically.
});

// Notes schema for the leads
export const notesDBSchema = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phone: text().notNull(),
  status: text().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  // Reactions
  user_id: int("user_id")
    .notNull()
    .references(() => userDBSchema.id, { onDelete: "cascade" }),
  lead_id: int("lead_id")
    .notNull()
    .references(() => leadsDBSchema.id, { onDelete: "cascade" }),
});

// Relations
export const relationsSchema = defineRelations(
  {
    userDBSchema,
    leadsDBSchema,
    notesDBSchema,
  },
  (r) => ({
    // User schema relations // One to Many
    userDBSchema: {
      leads: r.many.leadsDBSchema(),
      notes: r.many.notesDBSchema(),
    },

    // Leads schema relations // One to Many
    leadsDBSchema: {
      user: r.one.userDBSchema({
        from: r.leadsDBSchema.user_id,
        to: r.userDBSchema.id,
      }),

      notes: r.many.notesDBSchema(),
    },

    // Notes schema relations // One to One
    notesDBSchema: {
      user: r.one.userDBSchema({
        from: r.notesDBSchema.user_id,
        to: r.userDBSchema.id,
      }),

      lead: r.one.leadsDBSchema({
        from: r.notesDBSchema.lead_id,
        to: r.leadsDBSchema.id,
      }),
    },
  }),
);
