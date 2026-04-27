import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Minify for smaller APK size
    minify: 'esbuild',
    esbuildOptions: {
      compress: {
        drop_console: true,   // removes console.log in release build
      }
    },
    rollupOptions: {
      output: {
        // Code splitting for faster load
        manualChunks: {
          react: ['react', 'react-dom'],
        }
      }
    }
  },
  // CRITICAL for Capacitor: must use relative paths, not /
  base: './',
})
