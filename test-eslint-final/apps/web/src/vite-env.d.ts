/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
