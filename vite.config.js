import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

// The site is a single static page: index.html at the root, its logos in public/logos.
export default defineConfig({
  plugins: [viteCompression()],
})
