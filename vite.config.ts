import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'static/js',
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'lore',
            formats: ['es'],
            fileName: 'main'
        },
        rollupOptions: {
            output: {
                entryFileNames: 'main.js'
            }
        }
    }
});