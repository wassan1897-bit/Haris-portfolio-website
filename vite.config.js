import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// SEO plugin disabled while site is Haris Wassan intro-only
// import { generateSeoHtml } from './seo-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression()],
  server: {
    watch: {
      // Avoid EBUSY on local motion-capture MP4s at repo ./assets (not public site assets)
      ignored: ['**/portfolio-itom-main/assets/**', 'E:/portfolio-itom-main/assets/**'],
    },
    proxy: {
      '/sanity-cdn': {
        target: 'https://cdn.sanity.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sanity-cdn/, ''),
      },
    },
  },
})
