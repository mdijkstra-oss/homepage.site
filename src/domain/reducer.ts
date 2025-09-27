import { combineDictionaryReducers } from '@/utils/reducer/reducer'
import { inferenceReducer } from '@/domain/prompt/reducer/inferenceReducer'
import { defaultPromptsReducer } from '@/domain/prompt/reducer/defaultPromptsReducer'

export const defaultReducer = combineDictionaryReducers({
  defaultPrompts: defaultPromptsReducer,
  prompts: inferenceReducer,
})
