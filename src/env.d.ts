/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORYWRITER_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
