import { Navigation } from '@/layouts/PrimaryLayout/Navigation/Top'

import style from './layout.module.scss'

import { ExternalLink } from '@/layouts/PrimaryLayout/Navigation/Top/Navigation'
import { ContentBox } from '@/components/ContentBox/Box'
import { ActiveList } from '@/components/ActiveList'
import { useSocketReducer } from '@/layouts/PrimaryLayout/useSocketReducer'
import { defaultReducer } from '@/domain/reducer'
import { DefaultPromptInfo, PromptActionTypes } from '@/domain/prompt/prompt'
import { useEffect } from 'react'
import { PromptFeed } from '@/components/PromptFeed'

export const defaultExternalLinks: ExternalLink[] = [
  { tag: 'codeberg', url: 'https://codeberg.org/mdijkstra' },
  { tag: 'linkedin', url: 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/' },
  { tag: 'resume', url: 'https://mdijkstra.dev/resume' },
  { tag: 'contact', url: 'mailto:<hello@mdijkstra.dev>' },
]

const mapFromDefaultPrompt = (prompts: DefaultPromptInfo[]) => {
  return prompts.map((prompt) => ({
    path: `/${prompt.slug}`,
    label: prompt.shortTitle,
    active: false,
  }))
}

export const PrimaryLayout = () => {
  const { state, dispatch, connected } = useSocketReducer('ws://localhost:8080/ws', defaultReducer, {
    defaultPrompts: [],
    prompts: [],
  })

  const { defaultPrompts, prompts } = state

  useEffect(() => {
    if (!connected) return
    dispatch({ type: PromptActionTypes.FETCH_DEFAULT_PROMPTS })
  }, [connected, dispatch])

  useEffect(() => {
    if (!connected || !defaultPrompts.length) return

    dispatch({ type: PromptActionTypes.INFER, payload: defaultPrompts[2].prompt })
  }, [defaultPrompts, dispatch, connected])

  return (
    <div id={style.root}>
      <header>
        <Navigation externalLinks={defaultExternalLinks} />
      </header>
      <main className={style.container}>
        <nav>
          <ContentBox variant="secondary">
            <ActiveList items={mapFromDefaultPrompt(state.defaultPrompts)} />
          </ContentBox>
        </nav>

        <section>
          {prompts.map((prompt) => (
            <PromptFeed prompt={prompt} key={prompt.message} />
          ))}
        </section>
      </main>
      <footer></footer>
    </div>
  )
}
