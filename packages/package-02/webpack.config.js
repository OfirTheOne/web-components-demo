const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require('webpack').container;
const { ProvidePlugin } = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 4002,
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
      name: 'app2',
      filename: 'remoteEntry.js',
      exposes: {
        './views': './src/views',
        './components': './src/components', 
        './components/nav-bar': './src/components/nav-bar/nav-bar.component', 
      },
      remotes: {
        shared: `shared@http://localhost:4010/remoteEntry.js`,
      },
    })
  ],
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
    },
    extensions: ['.ts', '.js'],
  }
};
