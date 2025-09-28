import { createContext, useContext } from 'react'

type PromptContextFn = (message: string) => void

const PromptContext = createContext<PromptContextFn>(() => {})

export const usePrompt = () => useContext(PromptContext)

export default PromptContext
