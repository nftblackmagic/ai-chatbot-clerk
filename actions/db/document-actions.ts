import { db } from "@/lib/db/db"
import {
  InsertDocument,
  documentTable,
  SelectDocument,
  suggestionTable
} from "@/lib/db/schema"
import { eq, asc, desc, and, gt } from "drizzle-orm"
import { ArtifactKind } from "@/components/artifact"

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId
}: {
  id: string
  title: string
  kind: ArtifactKind
  content: string
  userId: string
}) {
  try {
    return await db.insert(documentTable).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date()
    })
  } catch (error) {
    console.error("Failed to save document in database")
    throw error
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.id, id))
      .orderBy(asc(documentTable.createdAt))

    return documents
  } catch (error) {
    console.error("Failed to get document by id from database")
    throw error
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.id, id))
      .orderBy(desc(documentTable.createdAt))

    return selectedDocument
  } catch (error) {
    console.error("Failed to get document by id from database")
    throw error
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp
}: {
  id: string
  timestamp: Date
}) {
  try {
    await db
      .delete(suggestionTable)
      .where(
        and(
          eq(suggestionTable.documentId, id),
          gt(suggestionTable.documentCreatedAt, timestamp)
        )
      )

    return await db
      .delete(documentTable)
      .where(
        and(eq(documentTable.id, id), gt(documentTable.createdAt, timestamp))
      )
  } catch (error) {
    console.error(
      "Failed to delete documents by id after timestamp from database"
    )
    throw error
  }
}
