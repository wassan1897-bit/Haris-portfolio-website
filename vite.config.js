import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import viteCompression from 'vite-plugin-compression'

// Static hosts answer unknown paths with 404.html. Making it a copy of the app lets the router
// resolve deep links such as /work/signal-engine on a refresh or a shared link.
function spaFallback() {
  let outDir
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    writeBundle() {
      fs.copyFileSync(path.join(outDir, 'index.html'), path.join(outDir, '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), spaFallback(), viteCompression()],
  // only the app's own entry; the mockups and media sources hold unrelated HTML files
  optimizeDeps: { entries: ['index.html'] },
  // a locked file in one of these (not app code) crashes the dev server's watcher on Windows
  server: {
    watch: { ignored: ['**/legacy-html/**', '**/mockups/**', '**/media-src/**', '**/project-media/**', '**/upscaled-photos/**', '**/dist/**'] },
  },
})
