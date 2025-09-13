import { AvailableIcon } from '@/components/Icon/Icon'
import style from './style.module.scss'
import { Tag } from './Tag'

export interface TagListProps {
  tags: AvailableIcon[]
}

export const TagList = ({ tags }: { tags: AvailableIcon[] }) => (
  <ul className={style.list}>
    {tags.map((tag) => (
      <li key={tag}>
        <Tag name={tag} />
      </li>
    ))}
  </ul>
)
