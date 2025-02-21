/*
Defines the Document schema used for storing documents associated with a user.
*/
import {
  pgTable,
  uuid,
  timestamp,
  text,
  varchar,
  primaryKey
} from "drizzle-orm/pg-core"
import { userTable } from "./user-schema"

export const documentTable = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),

    createdAt: timestamp("createdAt").notNull(),

    title: text("title").notNull(),

    content: text("content"),

    kind: varchar("kind", {
      enum: ["text", "code", "image", "sheet"]
    })
      .notNull()
      .default("text"),

    userId: text("user_id")
      .notNull()
      .references(() => userTable.userId)
  },
  table => ({
    pk: primaryKey({ columns: [table.id, table.createdAt] })
  })
)

export type InsertDocument = typeof documentTable.$inferInsert
export type SelectDocument = typeof documentTable.$inferSelect
