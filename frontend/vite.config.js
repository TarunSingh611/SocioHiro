import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'drops-reconstruction-website-maintaining.trycloudflare.com'
    ],
    port: 5173,
    host: true
  },
  build: {
    sourcemap: true
  },
  define: {
    __DEV__: true
  }
})
