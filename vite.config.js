import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Set the base path for GitHub Pages
  plugins: [react()],
  server: {
    hmr: {
      overlay: true,
      timeout: 60000, // keep HMR connection alive longer (default 5s can cause 504 after idle)
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
