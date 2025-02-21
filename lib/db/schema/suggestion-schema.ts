/*
Defines the Suggestion schema used for storing suggested changes for a document.
*/
import {
  pgTable,
  uuid,
  timestamp,
  text,
  boolean,
  primaryKey,
  foreignKey
} from "drizzle-orm/pg-core"
import { documentTable } from "./document-schema"
import { userTable } from "./user-schema"

export const suggestionTable = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),

    documentId: uuid("document_id").notNull(),

    documentCreatedAt: timestamp("document_created_at").notNull(),

    originalText: text("original_text").notNull(),

    suggestedText: text("suggested_text").notNull(),

    description: text("description"),

    isResolved: boolean("is_resolved").notNull().default(false),

    userId: text("user_id")
      .notNull()
      .references(() => userTable.userId),

    createdAt: timestamp("created_at").notNull()
  },
  table => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [documentTable.id, documentTable.createdAt]
    })
  })
)

export type InsertSuggestion = typeof suggestionTable.$inferInsert
export type SelectSuggestion = typeof suggestionTable.$inferSelect
