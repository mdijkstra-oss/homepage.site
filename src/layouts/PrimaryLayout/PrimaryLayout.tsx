import { Navigation } from '@/layouts/PrimaryLayout/Navigation/Top'

import style from './layout.module.scss'

import { ExternalLink } from '@/layouts/PrimaryLayout/Navigation/Top/Navigation'
import { ContentBox } from '@/components/ContentBox/Box'
import { ActiveList } from '@/components/ActiveList'
import { useSocketReducer } from '@/hooks/useSocketReducer'
import { defaultReducer } from '@/domain/reducer'
import { DefaultPromptInfo, PromptActionTypes } from '@/domain/prompt/prompt'
import { useCallback, useEffect } from 'react'
import { PromptFeed } from '@/components/PromptFeed'
import { useRouter } from '@/hooks/useRouter'
import PromptContext from '@/layouts/PrimaryLayout/PromptContext'

export const defaultExternalLinks: ExternalLink[] = [
  { tag: 'codeberg', url: 'https://codeberg.org/mdijkstra' },
  { tag: 'linkedin', url: 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/' },
  { tag: 'resume', url: 'https://mdijkstra.dev/resume' },
  { tag: 'contact', url: 'mailto:<hello@mdijkstra.dev>' },
]

const mapFromDefaultPrompt = (prompts: DefaultPromptInfo[], path: string) => {
  return prompts.map((prompt) => ({
    path: slugToPath(prompt.slug),
    label: prompt.shortTitle,
    active: prompt.slug === activePrompt(path, prompts)?.slug,
  }))
}

const activePrompt = (path: string, prompts: DefaultPromptInfo[]): DefaultPromptInfo => {
  return prompts.find((p) => slugToPath(p.slug) === path)
}

const slugToPath = (slug: string) => `/${slug}`

export const PrimaryLayout = () => {
  const { path, navigate } = useRouter()

  const { state, dispatch, connected } = useSocketReducer('ws://localhost:8080/ws', defaultReducer, {
    defaultPrompts: [],
    prompts: [],
  })

  const { defaultPrompts, prompts } = state

  const loadCompleted = connected && defaultPrompts.length > 0

  const prompt = useCallback(
    (message: string) => {
      dispatch({ type: PromptActionTypes.INFER, payload: message })
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    },
    [dispatch],
  )

  useEffect(() => {
    if (!connected) return
    dispatch({ type: PromptActionTypes.FETCH_DEFAULT_PROMPTS })
  }, [connected, dispatch])

  useEffect(() => {
    if (!loadCompleted) return

    const promptForPath = activePrompt(path, defaultPrompts)
    console.log({ promptForPath, path, defaultPrompts, loadCompleted })
    if (!promptForPath) {
      return navigate(defaultPrompts[0].slug)
    }

    prompt(promptForPath.prompt)
  }, [path, loadCompleted, dispatch, defaultPrompts, navigate, prompt])

  return (
    <PromptContext.Provider value={prompt}>
      <div id={style.root}>
        <header>
          <Navigation externalLinks={defaultExternalLinks} />
        </header>
        <main className={style.container}>
          <nav>
            <ContentBox variant="secondary">
              <ActiveList items={mapFromDefaultPrompt(state.defaultPrompts, path)} />
            </ContentBox>
          </nav>

          <section>
            {prompts.map((prompt) => (
              <PromptFeed prompt={prompt} key={prompt.id} />
            ))}
          </section>
        </main>
        <footer></footer>
      </div>
    </PromptContext.Provider>
  )
}
