const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  target: 'web',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 4000,
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      'node_modules': path.join(__dirname, '../../node_modules'),
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // app2: `app2@http://localhost:4002/remoteEntry.js`,
        app4: `app4@http://localhost:4004/remoteEntry.js`,
      },

    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};