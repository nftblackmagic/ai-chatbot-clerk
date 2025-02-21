/*
<ai_context>
Initializes the database connection and schema for the app.
</ai_context>
*/

import {
  messageTable,
  suggestionTable,
  userTable,
  documentTable,
  voteTable,
  chatTable
} from "@/lib/db/schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

config({ path: ".env.local" })

const schema = {
  users: userTable,
  chats: chatTable,
  messages: messageTable,
  votes: voteTable,
  documents: documentTable,
  suggestions: suggestionTable
}

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client, { schema })
