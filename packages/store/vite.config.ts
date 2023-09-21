import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
          entry: path.resolve(__dirname, "lib/index.ts"),
          name: pkg.name,
          fileName: "index",
        },
    },
    plugins: [dts()],
});