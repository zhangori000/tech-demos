import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Live-mode proxy: `bun run server` hosts the Bland API bridge on :3005.
      // When it isn't running the health check fails and the app stays in mock mode.
      '/api': 'http://localhost:3005',
    },
  },
})
