const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getTsxModuleRule = (isDevelopment = true) => ({
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
      plugins: [{ name: "typescript-plugin-css-modules" }],

      // typeRoots: ["node_modules/@types", "types", "../../types"],
    },
  },
});

const getScssLazyModuleRule = (isDevelopment = true) => ({
  test: /\.lazy\.s?css$/i,
  exclude: /node_modules/,
  use: [
    {
      loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
      options: {
        injectType: "lazyStyleTag",
        // https://webpack.js.org/loaders/style-loader/#custom-elements-shadow-dom
        insert: function insertIntoTarget(element, options) {
          options.registerStyle(element);
        },
      },
    },
    {
      loader: "css-loader",
      options: {
        sourceMap: isDevelopment,
      },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: isDevelopment,
      },
    },
  ],
});

const getScssModuleRule = (isDevelopment = true) => ({
  test: /\.scss$/i,
  exclude: [/\.lazy\.s?css$/i, /\.module\.s?css$/, /node_modules/],
  use: [
    // https://webpack.js.org/loaders/style-loader/#recommend
    isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        sourceMap: isDevelopment,
      },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: isDevelopment,
      },
    },
  ],
});

const getScssModuleModuleRule = (isDevelopment = true) => ({
  test: /\.module\.s?css$/,
  use: [
    isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: true,
        sourceMap: isDevelopment,
      },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: isDevelopment,
      },
    },
  ],
});

module.exports = {
  getRules: (isDevelopment = true) => {
    return [
      getTsxModuleRule(isDevelopment),
      getScssLazyModuleRule(isDevelopment),
      getScssModuleRule(isDevelopment),
      getScssModuleModuleRule(isDevelopment),
    ];
  },
};
