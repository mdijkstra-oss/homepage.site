import style from './style.module.scss'
import { AvailableIcon, Icon } from '@/components/Icon/Icon'

import vars from '@/variables.module.scss'
import { classnames } from '@/utils/css'
import { iconMapping } from '@/components/Icon/icons'

export interface TagProps {
  name: AvailableIcon
  transparent?: boolean
  onclick?: (title: string, icon: AvailableIcon) => void
}

export const Tag = ({ name, transparent = false, onclick }: TagProps) => {
  const icon = iconMapping[name]

  if (!icon) {
    console.warn(`Icon ${name} not found in iconMapping`)
    return null
  }

  const color = transparent ? 'transparent' : icon.color

  const clickEvent = () => onclick?.(icon.title, name)

  return (
    <span
      onClick={clickEvent}
      className={classnames(style.tag, { [style.transparent]: transparent, [style.clickable]: !!onclick })}
      style={{ backgroundColor: color }}
    >
      <span className={style.icon}>
        <Icon name={name} tint={vars.textLight} />
      </span>{' '}
      <span className={style.title}>{icon.title}</span>
    </span>
  )
}
