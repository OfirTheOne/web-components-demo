import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
          entry: path.resolve(__dirname, "lib/index.ts"),
          name: "sig",
          fileName: "sig",
        },
      },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'lib'),
        }
    },
    css: { modules: { localsConvention: 'camelCase' } },
    plugins: [dts()],

    // esbuild: {
    //     jsxFactory: 'Sig.createElement',
    //     jsxFragment: 'Sig.createFragment',
    //     jsxInject: `import { Sig } from 'lib/jsx'`,
    // },
});