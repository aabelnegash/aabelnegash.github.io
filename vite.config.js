import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const entry = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        home: entry('./index.html'),
        projects: entry('./projects/index.html'),
        validation: entry('./examples/hospital-validation/index.html'),
      },
    },
  },
});
