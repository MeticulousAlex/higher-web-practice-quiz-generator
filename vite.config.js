import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        quizzes: resolve(__dirname, 'quizzes.html'),
      },
    },
  },
  optimizeDeps: {
    include: [
      'idb',
      'nanoid',
      'zod',
    ],
  },
});