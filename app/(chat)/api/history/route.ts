import { auth } from "@clerk/nextjs/server"
import { getChatsByUserId } from "@/actions/db"

export async function GET() {
  const session = await auth()

  if (!session?.userId) {
    return Response.json("Unauthorized!", { status: 401 })
  }

  const chats = await getChatsByUserId({ id: session.userId })
  return Response.json(chats)
}
