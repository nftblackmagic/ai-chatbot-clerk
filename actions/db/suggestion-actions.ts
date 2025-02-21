import { db } from "@/lib/db/db"
import {
  InsertSuggestion,
  suggestionTable,
  SelectSuggestion
} from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function saveSuggestions({
  suggestions
}: {
  suggestions: Array<InsertSuggestion>
}) {
  try {
    return await db.insert(suggestionTable).values(suggestions)
  } catch (error) {
    console.error("Failed to save suggestions in database")
    throw error
  }
}

export async function getSuggestionsByDocumentId({
  documentId
}: {
  documentId: string
}) {
  try {
    return await db
      .select()
      .from(suggestionTable)
      .where(and(eq(suggestionTable.documentId, documentId)))
  } catch (error) {
    console.error("Failed to get suggestions by document version from database")
    throw error
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(suggestionTable)
      .where(eq(suggestionTable.id, id))
  } catch (error) {
    console.error("Failed to get message by id from database")
    throw error
  }
}
