/// <reference types="vite/client" />

// Set by bin/full_start so the app can run on its own ports alongside a dev
// session. Unset in dev, where the defaults in the code apply.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_WS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
