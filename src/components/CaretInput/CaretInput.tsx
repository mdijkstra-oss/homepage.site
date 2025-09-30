import style from './style.module.scss'
import { classnames } from '@/utils/css'
import { calculateCaretPos } from './caret'
import { mirrorTextStyles } from './mirror'
import * as React from 'react'
import { useRef, useEffect, ComponentPropsWithoutRef } from 'react'

type InputEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.FocusEvent<HTMLInputElement>
  | React.MouseEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLInputElement>

type InputComponentProps = ComponentPropsWithoutRef<'input'>

export type CaretInputProps = {
  // Only submits on enter button, clears content - use regular onChange etc for more control
  onValueSubmit?: (value: string) => void
  autofocus?: boolean
} & InputComponentProps

export const CaretInput = ({
  children,
  onChange,
  onFocus,
  onClick,
  onMouseDown,
  onMouseUp,
  className,
  onValueSubmit,
  autofocus,
  ...rest
}: CaretInputProps) => {
  const caretContainerRef = useRef<HTMLSpanElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autofocus) {
      return
    }

    // Initial focus
    inputRef.current?.focus()

    // Refocus on tab return
    const handleFocus = () => inputRef.current?.focus()
    window.addEventListener('focus', handleFocus)

    return () => window.removeEventListener('focus', handleFocus)
  }, [autofocus])

  const combineHandlers =
    <E extends InputEvent>(...handlers: Array<(event: E) => void>) =>
    (event: E): void => {
      handlers.forEach((handler) => handler?.(event))
    }

  const updateCaret = () =>
    (caretContainerRef.current.style.left = calculateCaretPos(inputRef.current, mirrorRef.current))

  const toggleVisibility = (visible: boolean) => () =>
    (caretContainerRef.current.style.visibility = visible ? 'visible' : 'hidden')

  const submitIfNeeded = (e: InputEvent) => {
    if ((e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter') {
      const inputValue = inputRef.current?.value
      if (onValueSubmit && inputValue) {
        onValueSubmit(inputValue)
        inputRef.current.value = '' // Clear the input content
        updateCaret()
      }
    }
  }

  useEffect(() => {
    mirrorTextStyles(inputRef.current, mirrorRef.current)
    updateCaret()
  }, [])

  return (
    <div className={style.container}>
      <input
        {...rest}
        className={classnames(style.input, className)}
        ref={inputRef}
        onChange={combineHandlers(onChange, updateCaret)}
        onFocus={combineHandlers(onFocus, updateCaret)}
        onClick={combineHandlers(onClick, updateCaret)}
        onMouseDown={combineHandlers(onMouseDown, toggleVisibility(false))}
        onMouseUp={combineHandlers(onMouseUp, toggleVisibility(true))}
        onKeyDown={submitIfNeeded}
      />
      <span ref={caretContainerRef} className={style.caretContainer}>
        {children || <span className={style.defaultCaret} />}
      </span>
      <div className={style.mirror} ref={mirrorRef} />
    </div>
  )
}
