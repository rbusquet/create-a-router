const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { env } = require("process");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
    ],
  },
};
