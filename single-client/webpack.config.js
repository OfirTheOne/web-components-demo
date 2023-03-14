const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const {
  getRules
} = require("./webpack-utils");

const isDevelopment = true;

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
      title: "our project",
      template: "public/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    }),
  ],
  module: {
    rules: [
      ...getRules()
    ],
  },
  resolve: {
    // plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],

    alias: {
      node_modules: path.join(__dirname, "../../node_modules"),
    },
    extensions: [".ts", ".tsx", ".js", ".scss", ".css"],
  },
};
