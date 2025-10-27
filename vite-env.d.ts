/// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_AUTH0_DOMAIN: string
    readonly VITE_AUTH0_CLIENT_ID: string
    readonly VITE_AUTH0_LOGIN_REDIRECT_URL: string
    // more env variables...
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
