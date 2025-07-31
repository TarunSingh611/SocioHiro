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
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets'
  },
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    // Ensure environment variables are available at build time
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
    'import.meta.env.VITE_INSTAGRAM_CLIENT_ID': JSON.stringify(process.env.VITE_INSTAGRAM_CLIENT_ID || '')
  },
  base: '/'
})
