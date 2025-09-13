import { ReactNode } from 'react'
import { classnames } from '@/utils/css'
import styles from './style.module.scss'

export const contentBoxVariants = ['primary', 'secondary'] as const
export type ContentBoxVariant = (typeof contentBoxVariants)[number]

export interface ContentBoxProps {
  children: ReactNode
  variant?: ContentBoxVariant
  key?: string
}

export const ContentBox = ({ children, variant = 'primary' }: ContentBoxProps) => {
  const Element = variant === 'secondary' ? 'div' : 'article'

  const className = classnames(styles.contentBox, styles[variant])

  return <Element className={className}>{children}</Element>
}
