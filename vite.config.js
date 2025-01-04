import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias for pdfjs-dist to resolve worker files correctly
      'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure proper file handling for dynamic imports
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.entry'],
  },
});
