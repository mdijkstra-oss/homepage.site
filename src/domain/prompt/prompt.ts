import { AvailableIcon } from '@/components/Icon/Icon'
import { Identifiable } from '@/utils/types'

export type Prompt = Identifiable & {
  message: string
  replies: Reply[]
}

export type Reply = Identifiable & {
  title: string
  content: string
  completed: boolean
  meta?: {
    tags?: AvailableIcon[]
    image?: string
    date: string
    endDate?: string
  }
}

export type DefaultPromptInfo = {
  slug: string
  prompt: string
  shortTitle: string
  priority: number
}

export enum PromptActionTypes {
  INFER = 'INFER_PROMPT',
  INFERRING = 'INFERRING_PROMPT',
  FETCH_DEFAULT_PROMPTS = 'FETCH_DEFAULT_PROMPTS',
  FETCHED_DEFAULT_PROMPTS = 'FETCHED_DEFAULT_PROMPTS',
}

export type InferPromptAction = {
  type: PromptActionTypes.INFER
  payload: Prompt
}

export type InferringPromptAction = {
  type: PromptActionTypes.INFERRING
  payload: Prompt
}

export type FetchDefaultPromptsAction = {
  type: PromptActionTypes.FETCH_DEFAULT_PROMPTS
}

export type FetchedDefaultPromptsAction = {
  type: PromptActionTypes.FETCHED_DEFAULT_PROMPTS
  payload: DefaultPromptInfo[]
}
