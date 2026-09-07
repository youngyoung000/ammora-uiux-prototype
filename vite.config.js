import { defineConfig } from 'vite'

export default defineConfig({
  base: globalThis.process?.env.GITHUB_ACTIONS ? '/ammora-uiux-prototype/' : '/',
})
