import { EntityAction, entityReducer, EntryAction } from '@/utils/reducer/entityReducer'
import { InferringPromptAction, Prompt, PromptActionTypes, Reply } from '@/domain/prompt/prompt'

type UpdateReplyAction = EntityAction<Reply>
type UpdateInferenceAction = UpdateReplyAction | InferringPromptAction

export function inferenceReducer(current: Prompt[], action: UpdateInferenceAction): Prompt[] {
  if (action.type === PromptActionTypes.INFERRING) {
    return [...current, action.payload]
  }

  return updatePromptReplies(current, action)
}

function updatePromptReplies(current: Prompt[], action: UpdateReplyAction): Prompt[] {
  if (![EntryAction.MERGE, EntryAction.APPEND].includes(action.type)) {
    return current
  }

  const { id } = action.payload

  return current.map((prompt) => {
    const targetReply = findReplyById(prompt.replies, id)
    if (!targetReply) return prompt

    return {
      ...prompt,
      replies: updateReplyById(prompt.replies, id, action),
    }
  })
}

function findReplyById(replies: Reply[], id: string): Reply | undefined {
  return replies.find((reply) => reply.id === id)
}

function updateReplyById(replies: Reply[], id: string, action: UpdateReplyAction): Reply[] {
  return replies.map((reply) => (reply.id === id ? entityReducer(action, reply, ['id']) : reply))
}
