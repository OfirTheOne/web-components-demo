const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require('webpack').container;
const { ProvidePlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');


module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 4004,
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [    
    new ProvidePlugin({
        process: 'process/browser',
    }),
    new ModuleFederationPlugin({
      name: 'app4',
      filename: 'remoteEntry.js',
      exposes: {
        // './views': './src/views',
        './components': './src/components', 
        './app': './src/app/app', 
      },
      remotes: {
        shared: `shared@http://localhost:4010/remoteEntry.js`,
        app2: `app2@http://localhost:4002/remoteEntry.js`,
      },
    })
  ],
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: { 
        // configFile: "./tsconfig.json",
        compilerOptions: {
          removeComments: false,
          "moduleResolution": "node",
          "jsx": "react",
          // "jsxImportSource": "wc-jsx",
          "jsxFragmentFactory": "WC.createFragment",
          "jsxFactory": "WC.createElement",
        }
      },
    }],
  },
  resolve: {
    // plugins: [new TsconfigPathsPlugin({configFile: "./tsconfig.json" })],
    // alias: {
    //   'node_modules': path.join(__dirname, '../../node_modules'),
    // },
    extensions: ['.ts', '.js', '.jsx', '.tsx'],
  }
};
