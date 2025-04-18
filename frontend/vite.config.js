import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Change 4400 to 8000
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
