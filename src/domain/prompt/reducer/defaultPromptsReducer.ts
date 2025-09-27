import { plainPayloadReducer } from '@/utils/reducer/reducer'
import { DefaultPromptInfo, PromptActionTypes } from '@/domain/prompt/prompt'

export const defaultPromptsReducer = plainPayloadReducer<DefaultPromptInfo[]>(PromptActionTypes.FETCHED_DEFAULT_PROMPTS)
