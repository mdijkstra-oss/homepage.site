import { combineDictionaryReducers, debugReducer } from '@/utils/reducer/reducer'
import { inferenceReducer } from '@/domain/prompt/reducer/inferenceReducer'
import { defaultPromptsReducer } from '@/domain/prompt/reducer/defaultPromptsReducer'

const mainReducer = combineDictionaryReducers({
  defaultPrompts: defaultPromptsReducer,
  prompts: inferenceReducer,
})

export const defaultReducer = debugReducer(mainReducer)
