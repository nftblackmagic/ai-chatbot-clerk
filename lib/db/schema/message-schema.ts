import { pgTable, uuid, timestamp, varchar, json } from "drizzle-orm/pg-core"
import { chatTable } from "./chat-schema"

export const messageTable = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatTable.id),

  role: varchar("role").notNull(),

  content: json("content").notNull(),

  createdAt: timestamp("created_at").notNull()
})

export type InsertMessage = typeof messageTable.$inferInsert
export type SelectMessage = typeof messageTable.$inferSelect
