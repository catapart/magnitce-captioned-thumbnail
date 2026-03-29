import { defineConfig } from "vite";
import { default as terser } from '@rollup/plugin-terser';
import dts from 'vite-plugin-dts';

export default defineConfig({
    server: {
        
    },
    build: {
        lib: {
            entry: ['src/captioned-thumbnail.ts'],
        },
        minify: false,
        copyPublicDir: false,
        rollupOptions: {
            external: [
                '**/*tests.ts',
                '**/*tests.js',
            ],
            output: [
                {
                    dir: 'dist',
                    entryFileNames: 'captioned-thumbnail.js',
                    format: 'es',
                },
                {
                    dir: 'dist',
                    entryFileNames: 'captioned-thumbnail.min.js',
                    format: 'es',
                    plugins: [terser()]
                },
                {
                    dir: 'dist',
                    name: 'captioned-thumbnail.umd.js',
                    entryFileNames: 'captioned-thumbnail.umd.js',
                    format: 'umd',
                },
                {
                    dir: 'dist',
                    entryFileNames: 'captioned-thumbnail.umd.min.js',
                    name: 'captioned-thumbnail.umd.min.js',
                    format: 'umd',
                    plugins: [terser()]
                }
            ]
        }
    },
    plugins: [dts({ exclude: ["**/*.test.ts", 'src/dev'], rollupTypes: true })]
});