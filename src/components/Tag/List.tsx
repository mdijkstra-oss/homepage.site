import { AvailableIcon } from '@/components/Icon/Icon'
import style from './style.module.scss'
import { Tag } from './Tag'

export interface TagListProps {
  tags: AvailableIcon[]
  onclick?: (title: string, icon: AvailableIcon) => void
}

export const TagList = ({ tags, onclick }: TagListProps) => (
  <ul className={style.list}>
    {tags.map((tag) => (
      <li key={tag}>
        <Tag name={tag} onclick={onclick} />
      </li>
    ))}
  </ul>
)
