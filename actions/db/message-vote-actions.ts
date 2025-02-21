import { db } from "@/lib/db/db"
import { InsertVote, voteTable, SelectVote } from "@/lib/db/schema/vote-schema"
import {
  InsertMessage,
  messageTable,
  SelectMessage
} from "@/lib/db/schema/message-schema"
import { eq, and, asc, inArray, gte } from "drizzle-orm"

export async function saveMessages({
  messages
}: {
  messages: Array<InsertMessage>
}) {
  try {
    return await db.insert(messageTable).values(messages)
  } catch (error) {
    console.error("Failed to save messages in database", error)
    throw error
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.chatId, id))
      .orderBy(asc(messageTable.createdAt))
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error)
    throw error
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type
}: {
  chatId: string
  messageId: string
  type: "up" | "down"
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(voteTable)
      .where(and(eq(voteTable.messageId, messageId)))

    if (existingVote) {
      return await db
        .update(voteTable)
        .set({ isUpvoted: type === "up" })
        .where(
          and(eq(voteTable.messageId, messageId), eq(voteTable.chatId, chatId))
        )
    }
    return await db.insert(voteTable).values({
      chatId,
      messageId,
      isUpvoted: type === "up"
    })
  } catch (error) {
    console.error("Failed to upvote message in database", error)
    throw error
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(voteTable).where(eq(voteTable.chatId, id))
  } catch (error) {
    console.error("Failed to get votes by chat id from database", error)
    throw error
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp
}: {
  chatId: string
  timestamp: Date
}) {
  try {
    const messagesToDelete = await db
      .select({ id: messageTable.id })
      .from(messageTable)
      .where(
        and(
          eq(messageTable.chatId, chatId),
          gte(messageTable.createdAt, timestamp)
        )
      )

    const messageIds = messagesToDelete.map(message => message.id)

    if (messageIds.length > 0) {
      await db
        .delete(voteTable)
        .where(
          and(
            eq(voteTable.chatId, chatId),
            inArray(voteTable.messageId, messageIds)
          )
        )

      return await db
        .delete(messageTable)
        .where(
          and(
            eq(messageTable.chatId, chatId),
            inArray(messageTable.id, messageIds)
          )
        )
    }
  } catch (error) {
    console.error(
      "Failed to delete messages by id after timestamp from database"
    )
    throw error
  }
}
