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
        rollupOptions: {
            external: ['sig'],
            output: {
                globals: {
                    sig: 'Sig',
                },
            },
        },
    },
    // esbuild: {
    //     jsxFactory: '__createElement',
    //     jsxFragment: '__createFragment',
    //     jsxInject: `import { createFragment as __createFragment, createElement as __createElement } from 'sig'`,
    // },
    css: { modules: { localsConvention: 'camelCase' } },
    plugins: [dts()],
});