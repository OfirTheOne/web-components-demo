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
    port: 4003,
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
      name: 'app3',
      filename: 'remoteEntry.js',
      exposes: {
        // './views': './src/views',
        './components': './src/components', 
        './components/card': './src/components/card/card.component', 
      },
      // remotes: {
      //   shared: `shared@http://localhost:4010/remoteEntry.js`,
      // },
    })
  ],
  module: {
    rules: [
      // {
      //   // Include ts, tsx, js, and jsx files.
      //   test: /\.(ts|js)x?$/,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader',
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      'node_modules': path.join(__dirname, '../../node_modules'),
    },
    extensions: ['.ts', '.js', '.jsx', '.tsx'],
  }
};
