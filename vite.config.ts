import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    resolve: {
        alias: {
            '@lib': path.resolve(__dirname, 'src/lib'),
        }
    },
    css: { modules: { localsConvention: 'camelCase' } },
    esbuild: {
        jsxFactory: 'WC.createElement',
        jsxFragment: 'WC.createFragment',
        jsxInject: `import { WC } from '@lib/jsx'`,
    },
});