import { generateUUID } from "@/lib/utils"
import { DataStreamWriter, tool } from "ai"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server" // <--- Clerk auth
import {
  artifactKinds,
  documentHandlersByArtifactKind
} from "@/lib/artifacts/server"

interface CreateDocumentProps {
  dataStream: DataStreamWriter
}

// We remove `session: Session` since NextAuth Session is no longer used
export const createDocument = ({ dataStream }: CreateDocumentProps) =>
  tool({
    description:
      "Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.",
    parameters: z.object({
      title: z.string(),
      kind: z.enum(artifactKinds)
    }),
    execute: async ({ title, kind }) => {
      // Retrieve the user info from Clerk - add await
      const session = await auth()
      const userId = session.userId

      // Ensure the user is logged in
      if (!userId) {
        throw new Error("Unauthorized: No user is logged in.")
      }

      const id = generateUUID()

      dataStream.writeData({ type: "kind", content: kind })
      dataStream.writeData({ type: "id", content: id })
      dataStream.writeData({ type: "title", content: title })
      dataStream.writeData({ type: "clear", content: "" })

      const documentHandler = documentHandlersByArtifactKind.find(
        handler => handler.kind === kind
      )

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${kind}`)
      }

      // Update onCreateDocument to accept userId (or more Clerk data as needed)
      await documentHandler.onCreateDocument({
        id,
        title,
        dataStream,
        userId
      })

      dataStream.writeData({ type: "finish", content: "" })

      return {
        id,
        title,
        kind,
        content: "A document was created and is now visible to the user."
      }
    }
  })
