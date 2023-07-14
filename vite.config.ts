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
        jsxFactory: 'Sig.createElement',
        jsxFragment: 'Sig.createFragment',
        jsxInject: `import { Sig } from '@lib/jsx'`,
    },
});