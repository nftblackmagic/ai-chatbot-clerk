import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText
} from "ai"

import { auth } from "@clerk/nextjs/server"
import { myProvider } from "@/lib/ai/models"
import { systemPrompt } from "@/lib/ai/prompts"
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages
} from "@/actions/db"
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages
} from "@/lib/utils"

import { generateTitleFromUserMessage } from "../../actions"
import { createDocument } from "@/lib/ai/tools/create-document"
import { updateDocument } from "@/lib/ai/tools/update-document"
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions"
import { getWeather } from "@/lib/ai/tools/get-weather"
import { notFound } from "next/navigation"

export const maxDuration = 60

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json()

  const session = await auth()

  if (!session?.userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userMessage = getMostRecentUserMessage(messages)

  if (!userMessage) {
    return new Response("No user message found", { status: 400 })
  }

  const { isSuccess, data } = await getChatById({ id })

  if (!isSuccess || !data) {
    const title = await generateTitleFromUserMessage({ message: userMessage })
    const { isSuccess } = await saveChat({ id, userId: session.userId, title })
    if (!isSuccess) {
      return new Response("Failed to save chat", { status: 400 })
    }
  }

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }]
  })

  return createDataStreamResponse({
    execute: dataStream => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        experimental_activeTools:
          selectedChatModel === "chat-model-reasoning"
            ? []
            : [
                "getWeather",
                "createDocument",
                "updateDocument",
                "requestSuggestions"
              ],
        experimental_transform: smoothStream({ chunking: "word" }),
        experimental_generateMessageId: generateUUID,
        tools: {
          getWeather,
          createDocument: createDocument({ dataStream }),
          updateDocument: updateDocument({ dataStream }),
          requestSuggestions: requestSuggestions({ dataStream })
        },
        onFinish: async ({ response, reasoning }) => {
          if (session.userId) {
            try {
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning
              })
              console.log(
                "sanitizedResponseMessages",
                sanitizedResponseMessages
              )
              await saveMessages({
                messages: sanitizedResponseMessages.map(message => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date()
                  }
                })
              })
            } catch (error) {
              console.error("Failed to save chat")
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text"
        }
      })

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true
      })
    },
    onError: () => {
      return "Oops, an error occured!"
    }
  })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return new Response("Not Found", { status: 404 })
  }

  const session = await auth()

  if (!session?.userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const chatResult = await getChatById({ id })
    if (!chatResult.isSuccess || !chatResult.data) {
      return new Response("Not Found", { status: 404 })
    }

    if (chatResult.data.userId !== session.userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    await deleteChatById({ id })

    return new Response("Chat deleted", { status: 200 })
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500
    })
  }
}
