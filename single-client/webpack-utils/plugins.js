const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  getPlugins: (isDevelopment = true) => {
    const htmlWebpackPlugin = new HtmlWebpackPlugin({
        title: "our project",
        template: "public/index.html",
    });
    const miniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: isDevelopment ? "[name].css" : "[name].[hash].css",
        chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    });
    return [htmlWebpackPlugin, miniCssExtractPlugin];
  },
};
