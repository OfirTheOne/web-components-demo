const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'our project', 
      template: 'public/index.html' }) 
    // new ModuleFederationPlugin({
    //   name: "shared",
    //   filename: "remoteEntry.js",
    //   exposes: {
    //     "./jsx": "./src/jsx",
    //     "./decorators": "./src/decorators",
    //     "./utils": "./src/utils",
    //     "./core": "./src/core",
    //   },
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          // configFile: "./tsconfig.json",
          compilerOptions: {
            removeComments: false,
            moduleResolution: "node",
            jsx: "react",
            jsxFragmentFactory: "WC.createFragment",
            jsxFactory: "WC.createElement",
            // typeRoots: ["node_modules/@types", "types", "../../types"],
          },
        },
      },
    ],
  },
  resolve: {
    // plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],

    alias: {
      node_modules: path.join(__dirname, "../../node_modules"),
    },
    extensions: [".ts", ".tsx", ".js"],
  },
};
