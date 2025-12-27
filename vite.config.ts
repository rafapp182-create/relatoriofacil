
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: __dirname is not available in ESM environments. We define it using fileURLToPath and path.dirname.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
    // Note: Manual process.env definitions for API_KEY are removed because 
    // the variable is injected automatically in the execution context.
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        chunkSizeWarningLimit: 1000,
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
