import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7100,
    cors: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'umd',
        entryFileNames: 'root-main.js',
        name: 'rootMain'
      }
    }
  }
});


