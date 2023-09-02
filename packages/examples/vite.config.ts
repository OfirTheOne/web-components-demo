import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    resolve: {
        // alias: {
        //     'sig': path.resolve(__dirname, 'sig/lib'),
        // }
    },
    css: { modules: { localsConvention: 'camelCase' } },
    esbuild: {
        jsxFactory: 'Sig.createElement',
        jsxFragment: 'Sig.createFragment',
        jsxInject: `import { Sig } from 'sig'`,
    },
    optimizeDeps: {
        disabled: true,
        // include: [path.resolve(__dirname, '../sig/dist/sig.js'),],
    },
});