import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true, secure: false },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true, secure: false },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lottie': ['lottie-web'],
          'smooth-scroll': ['lenis'],
        },
      },
      onwarn(warning, warn) {
        // Suppress eval warnings from lottie-web (known safe usage in animation library)
        if (
          warning.code === 'EVAL' &&
          warning.loc?.file?.includes('lottie-web')
        ) {
          return;
        }
        // Use default warning handler for all other warnings
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 KB
  },
})
