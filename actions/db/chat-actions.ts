/*
<ai_context>
Contains server actions related to profiles in the DB.
</ai_context>
*/

"use server"

import { db } from "@/lib/db/db"
import {
  InsertChat,
  chatTable,
  SelectChat,
  messageTable,
  voteTable
} from "@/lib/db/schema"
import { ActionState } from "@/types"
import { desc, eq } from "drizzle-orm"

export async function saveChat({
  id,
  userId,
  title
}: { id: string } & Omit<InsertChat, "id">): Promise<ActionState<SelectChat>> {
  try {
    const [newChat] = await db
      .insert(chatTable)
      .values({
        id,
        createdAt: new Date(),
        userId,
        title
      })
      .returning()

    return {
      isSuccess: true,
      message: "Chat saved successfully",
      data: newChat
    }
  } catch (error) {
    console.error("Failed to save chat in database", error)
    return {
      isSuccess: false,
      message: "Failed to save chat"
    }
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(voteTable).where(eq(voteTable.chatId, id))
    await db.delete(messageTable).where(eq(messageTable.chatId, id))

    return await db.delete(chatTable).where(eq(chatTable.id, id))
  } catch (error) {
    console.error("Failed to delete chat by id from database")
    throw error
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chatTable)
      .where(eq(chatTable.userId, id))
      .orderBy(desc(chatTable.createdAt))
  } catch (error) {
    console.error("Failed to get chats by user from database")
    throw error
  }
}

export async function getChatById({
  id
}: {
  id: string
}): Promise<ActionState<SelectChat>> {
  try {
    const [selectedChat] = await db
      .select()
      .from(chatTable)
      .where(eq(chatTable.id, id))
    if (!selectedChat) {
      return { isSuccess: false, message: "Chat not found" }
    }
    return { isSuccess: true, message: "Chat found", data: selectedChat }
  } catch (error) {
    console.error("Failed to get chat by id from database")
    return { isSuccess: false, message: "Failed to get chat" }
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility
}: {
  chatId: string
  visibility: "private" | "public"
}) {
  try {
    return await db
      .update(chatTable)
      .set({ visibility })
      .where(eq(chatTable.id, chatId))
  } catch (error) {
    console.error("Failed to update chat visibility in database")
    throw error
  }
}
