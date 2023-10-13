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
        jsxFactory: '__createElement',
        jsxFragment: '__createFragment',
        jsxInject: `import { createFragment as __createFragment, createElement as __createElement } from '@sigjs/sig'`,
    },
    optimizeDeps: {
        disabled: true,
        // include: [path.resolve(__dirname, '../sig/dist/sig.js'),],
    },
});