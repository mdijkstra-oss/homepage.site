import { Navigation } from '@/layouts/PrimaryLayout/Navigation/Top'

import style from './layout.module.scss'

import { ExternalLink } from '@/layouts/PrimaryLayout/Navigation/Top/Navigation'
import { ContentBox } from '@/components/ContentBox/Box'
import { ActiveList } from '@/components/ActiveList'
import { PromptFeed } from '@/components/PromptFeed'
import { samplePrompt } from '@/components/PromptFeed/sample'

export const defaultExternalLinks: ExternalLink[] = [
  { tag: 'codeberg', url: 'https://codeberg.org/mdijkstra' },
  { tag: 'linkedin', url: 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/' },
  { tag: 'resume', url: 'https://mdijkstra.dev/resume' },
  { tag: 'contact', url: 'mailto:<hello@mdijkstra.dev>' },
]

const sampleListItems = [
  { path: '/introduction', label: 'Introduction', active: true },
  { path: '/experience', label: 'Experience', active: false },
  { path: '/recommendations', label: 'Recommendations', active: false },
  { path: '/open-source', label: 'Open Source', active: false },
  { path: '/patents', label: 'Patents', active: false },
  { path: '/education', label: 'Education', active: false },
]

export const PrimaryLayout = () => {
  return (
    <div id={style.root}>
      <header>
        <Navigation externalLinks={defaultExternalLinks} />
      </header>
      <main className={style.container}>
        <nav>
          <ContentBox variant="secondary">
            <ActiveList items={sampleListItems} />
          </ContentBox>
        </nav>

        <section>
          <PromptFeed prompt={samplePrompt} />
        </section>
      </main>
      <footer></footer>
    </div>
  )
}
