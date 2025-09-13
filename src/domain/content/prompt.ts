import { AvailableIcon } from '@/components/Icon/Icon'
import { Identifiable, Identifier } from '@/utils/types'
// import { randomUUID } from "crypto"

export type Prompt = Identifiable & {
  message: string
  replies: Map<Identifier, Reply>
}

export type Reply = Identifiable & {
  promptId: Identifier
  title: string
  content: string
  completed: boolean
  meta?: {
    tags?: AvailableIcon[]
    image?: string
    date: Date
    endDate?: Date
  }
}

export function makePrompt(message: string, replies: Reply[] = [], id: string): Prompt {
  // if (!id) { id = randomUUID() }

  return {
    id,
    message,
    replies: new Map(replies.map((reply) => [reply.id, reply])),
  }
}
