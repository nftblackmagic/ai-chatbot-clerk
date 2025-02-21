/*
Defines the Vote schema used for storing up/down vote information on messages.
*/
import { pgTable, boolean, primaryKey, uuid } from "drizzle-orm/pg-core"
import { chatTable } from "./chat-schema"
import { messageTable } from "./message-schema"

export const voteTable = pgTable(
  "Vote",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chatTable.id),

    messageId: uuid("message_id")
      .notNull()
      .references(() => messageTable.id),

    isUpvoted: boolean("is_upvoted").notNull()
  },
  table => ({
    pk: primaryKey({ columns: [table.chatId, table.messageId] })
  })
)

export type InsertVote = typeof voteTable.$inferInsert
export type SelectVote = typeof voteTable.$inferSelect
