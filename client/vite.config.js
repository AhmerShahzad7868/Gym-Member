import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Moves inside 'target'
        changeOrigin: true,              // Moves inside this object
        secure: false,                   // (Optional) Good for local dev
      },
    },
  },
});