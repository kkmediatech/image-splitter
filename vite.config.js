import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/image-splitter/',  // Replace 'image-splitter' with your repository name
})