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
      remotes: {
        shared: `shared@http://localhost:4010/remoteEntry.js`,
      },
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            "jsx": "react",
          }
        }
      },
    ],
  },
  resolve: {
    plugins: [    
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }),
    ],
    // alias: {
    //   'node_modules': path.join(__dirname, '../../node_modules'),
    // },
    extensions: ['.ts', '.js', '.jsx', '.tsx'],
  }
};
