import { classnames } from '@/utils/css'
import styles from './style.module.scss'

export interface Entry {
  path: string
  label: string
  active: boolean
}

export interface ActiveListProps {
  items: Entry[]
}

export const ActiveList = ({ items }: ActiveListProps) => {
  return (
    <div className={styles.activeList}>
      {items.map((item) => (
        <div key={item.path} className={classnames(styles.item, { [styles.active]: item.active })}>
          <a href={item.path}>{item.label}</a>
        </div>
      ))}
    </div>
  )
}
