import { CaretInput } from '@/components/CaretInput'
import styles from './style.module.scss'

type PromptInputProps = {
  onSubmit: (value: string) => void
}

export function PromptInput({ onSubmit }: PromptInputProps) {
  return (
    <CaretInput className={styles.input} onValueSubmit={onSubmit} placeholder="Enter prompt" autofocus>
      <span className={styles.caret} />
    </CaretInput>
  )
}
