import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// base './' + hash routing = works on GitHub Pages under any repo subpath
export default defineConfig({
  base: './',
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: fileURLToPath(new URL('./src/quasar-variables.sass', import.meta.url)) })
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
} as any)
