import { EntityAction, EntryAction, updateMatchingIdentity } from '@/utils/reducer/entityReducer'
import { InferringPromptAction, Prompt, PromptActionTypes, Reply } from '@/domain/prompt/prompt'

type UpdatePromptAction = EntityAction<Prompt>
type UpdateReplyAction = EntityAction<Reply>

type UpdateInferenceAction = UpdatePromptAction | UpdateReplyAction | InferringPromptAction

export function inferenceReducer(current: Prompt[], action: UpdateInferenceAction): Prompt[] {
  if (action.type === PromptActionTypes.INFERRING) {
    return [...current, action.payload]
  }

  if (![EntryAction.MERGE, EntryAction.APPEND].includes(action.type)) {
    return current
  }

  const { id } = action.payload

  return current.map((prompt) => {
    const hasMatchingReply = prompt.replies.some((reply) => reply.id === id)
    if (hasMatchingReply) {
      return {
        ...prompt,
        replies: prompt.replies.map((reply) => updateMatchingIdentity(reply, action as UpdateReplyAction)),
      }
    }

    return updateMatchingIdentity(prompt, action as UpdatePromptAction)
  })
}
