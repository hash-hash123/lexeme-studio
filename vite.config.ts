import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is '/' by default (Vercel and other root-served hosts).
// Set VITE_BASE_PATH=/lexeme-studio/ for GitHub Pages builds (see .github/workflows/deploy.yml).
const basePath = process.env.VITE_BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: basePath,
})
