/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_URL: string;
  readonly VITE_POSTHOG_KEY?: string;
}
