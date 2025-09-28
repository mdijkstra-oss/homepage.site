import logo from '@/assets/logo.png'
import style from './style.module.scss'
import { AvailableIcon } from '@/components/Icon/Icon'
import { classnames } from '@/utils/css'
import { Tag } from '@/components/Tag'
import { ReactNode } from 'react'

export type ExternalLink = {
  tag: AvailableIcon
  url: string
}

export interface NavigationProps {
  externalLinks: ExternalLink[]
}

export const Navigation = ({ externalLinks }: NavigationProps) => {
  return (
    <nav className={style.bar}>
      <ul className={classnames(style.navContainer)}>
        <li>
          <NavigationLink href="/" title="Go to home page">
            <img className={style.logo} src={logo} alt="mdijkstra.dev Logo" />
          </NavigationLink>
        </li>
        {externalLinks.map(({ tag, url }) => (
          <li key={tag}>
            <NavigationLink href={url} title={`Open ${tag} profile`}>
              <Tag name={tag} transparent />
            </NavigationLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

type NavigationLinksProps = {
  href: string
  children: ReactNode
  title?: string
}

const NavigationLink = ({ href, title, children }: NavigationLinksProps) => {
  const rel = href.startsWith('http') ? 'external nofollow' : ''
  return (
    <a href={href} rel={rel} title={title}>
      {children}
    </a>
  )
}
