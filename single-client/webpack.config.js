const path = require('path');

const { getRules, getPlugins } = require('./webpack-utils');

const isDevelopment = true;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    static: [path.join(__dirname, 'dist'), path.join(__dirname, 'public') ] ,
    compress: true,
    port: 4000,
    historyApiFallback: true 
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [...getPlugins(isDevelopment)],
  module: {
    rules: [...getRules(isDevelopment)],
  },
  resolve: {
    // plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],

    alias: {
      node_modules: path.join(__dirname, '../../node_modules'),
    },
    extensions: ['.ts', '.tsx', '.js', '.scss', '.css'],
  },
};
