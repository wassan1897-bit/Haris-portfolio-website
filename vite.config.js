import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  // every page is also written out as finished HTML after the build: see scripts/prerender.mjs
  plugins: [react(), viteCompression()],
  // only the app's own entry; the mockups and media sources hold unrelated HTML files
  optimizeDeps: { entries: ['index.html'] },
  // a locked file in one of these (not app code) crashes the dev server's watcher on Windows
  server: {
    watch: { ignored: ['**/legacy-html/**', '**/mockups/**', '**/media-src/**', '**/project-media/**', '**/upscaled-photos/**', '**/dist/**'] },
  },
})
