import { Navigation } from '@/layouts/PrimaryLayout/Navigation/Top'

import style from './layout.module.scss'

import { ExternalLink } from '@/layouts/PrimaryLayout/Navigation/Top/Navigation'
import { ContentBox } from '@/components/ContentBox/Box'
import { ActiveList } from '@/components/ActiveList'
import { useSocketReducer } from '@/hooks/useSocketReducer'
import { defaultReducer } from '@/domain/reducer'
import { DefaultPromptInfo, Prompt, PromptActionTypes, Request } from '@/domain/prompt/prompt'
import { useCallback, useEffect, useRef } from 'react'
import { PromptFeed } from '@/components/PromptFeed'
import { useRouter } from '@/hooks/useRouter'
import PromptContext from '@/layouts/PrimaryLayout/PromptContext'
import { PromptInput } from '@/components/PromptInput'

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
const promptsForNamespace = (prompts: Prompt[], namespace: string) => prompts.filter((p) => p.namespace === namespace)
const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

export const PrimaryLayout = () => {
  const { path, navigate } = useRouter()

  const isFirstRenderForPage = useRef(true)
  const isFirstMount = useRef(true)

  useEffect(() => {
    isFirstRenderForPage.current = true
  }, [path])

  // Todo: different based on env
  const { state, dispatch, connected } = useSocketReducer(getWsUrl(), defaultReducer, {
    defaultPrompts: [],
    prompts: [],
  })

  const { defaultPrompts, prompts } = state

  const loadCompleted = connected && defaultPrompts.length > 0

  const prompt = useCallback(
    async (message: string) => {
      const request: Request = {
        message: message,
        namespace: path,
      }

      dispatch({ type: PromptActionTypes.INFER, payload: request })
    },
    [dispatch, path],
  )

  useEffect(() => {
    if (!connected) return
    dispatch({ type: PromptActionTypes.FETCH_DEFAULT_PROMPTS })
  }, [connected, dispatch])

  useEffect(() => {
    if (!loadCompleted) return

    const promptForPath = activePrompt(path, defaultPrompts)

    if (!promptForPath) {
      return navigate(`/${defaultPrompts[0].slug}`)
    }

    // Only request initial prompt on first landing of page
    if (promptsForNamespace(prompts, path).length === 0) {
      prompt(promptForPath.prompt).catch(console.error)
    }
  }, [path, loadCompleted, dispatch, defaultPrompts, navigate, prompt, prompts])

  useEffect(() => {
    if (prompts.length === 0) return

    if (isFirstRenderForPage.current) {
      isFirstRenderForPage.current = false
      isFirstMount.current = false
      return
    }

    scrollToBottom()
  }, [prompts])

  return (
    <PromptContext.Provider value={prompt}>
      <div id={style.root}>
        <header>
          <Navigation externalLinks={defaultExternalLinks} />
        </header>
        <main className={style.container}>
          <nav>
            <ContentBox variant="secondary">
              <ActiveList items={mapFromDefaultPrompt(defaultPrompts, path)} />
            </ContentBox>
          </nav>

          <section>
            {promptsForNamespace(prompts, path).map((current) => (
              <PromptFeed prompt={current} key={current.id} />
            ))}
          </section>
        </main>

        <footer className={style.blurrer}>
          <PromptInput onSubmit={prompt} />
        </footer>
      </div>
    </PromptContext.Provider>
  )
}

const getWsUrl = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_API
  if (backendUrl) {
    // ngrok: replace https with wss, no port needed
    return backendUrl.replace('https://', 'wss://') + '/ws'
  }
  // local dev
  return 'ws://localhost:8082/ws'
}
