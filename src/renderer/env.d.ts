/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component
}

// see: https://cn.electron-vite.org/guide/env-and-mode
interface ImportMetaEnv {
  readonly MAIN_VITE_SOME_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
