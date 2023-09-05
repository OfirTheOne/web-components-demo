import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
          entry: path.resolve(__dirname, "lib/index.ts"),
          name: "sig",
          fileName: "index",
        },
      },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'lib'),
        }
    },
    css: { modules: { localsConvention: 'camelCase' } },
    plugins: [dts()],
});