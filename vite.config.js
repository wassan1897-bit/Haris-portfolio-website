import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import viteCompression from 'vite-plugin-compression'

const root = fileURLToPath(new URL('.', import.meta.url))

// The site is a single static page: index.html at the root, its logos in public/logos.
// The pages in public/ are copied as they are, so the AI assistant is also published as /assistant.js
// for them to load: in dev that path serves src/assistant.js, in the build it is a fixed-name entry.
const assistant = {
  name: 'assistant-entry',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/assistant.js') req.url = '/src/assistant.js'
      next()
    })
  },
}

export default defineConfig({
  plugins: [assistant, viteCompression()],
  build: {
    rollupOptions: {
      input: { main: resolve(root, 'index.html'), assistant: resolve(root, 'src/assistant.js') },
      output: { entryFileNames: (chunk) => (chunk.name === 'assistant' ? 'assistant.js' : 'assets/[name]-[hash].js') },
    },
  },
})
