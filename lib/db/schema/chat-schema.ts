/*
<ai_context>
Defines the database schema for chats based on the user schema.
</ai_context>
*/

import { pgTable, timestamp, uuid, text, varchar } from "drizzle-orm/pg-core"
import { userTable } from "./user-schema"

export const chatTable = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  title: text("title").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.userId),

  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private")
})

export type InsertChat = typeof chatTable.$inferInsert
export type SelectChat = typeof chatTable.$inferSelect
