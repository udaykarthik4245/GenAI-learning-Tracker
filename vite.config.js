import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Use relative asset paths so the built app works when served from
  // a subpath (GitHub Pages) or from a root (Vercel). Using './' makes
  // the HTML reference assets relatively which avoids 404s for /assets/*
  // when the site is not hosted at the domain root.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
