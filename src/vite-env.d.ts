/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public, unauthenticated Vitrine feed projection. Unset = static archive. Never a token. */
  readonly VITE_VITRINE_FEED_URL?: string;
  /** Vitrine panel where the owner manages the Instagram connection. */
  readonly VITE_VITRINE_MANAGE_URL?: string;
}
