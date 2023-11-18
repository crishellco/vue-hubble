import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'plugin/src/index.js'),
      fileName: (format) => `vue-hubble.${format}.js`,
      name: 'VueHubble',
    },
    rollupOptions: {
      external: ['vue'],
    },
    sourcemap: true,
  },
  plugins: [],
});
