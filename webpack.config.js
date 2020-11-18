const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => ({
  mode: argv.mode || "development",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  devtool: "source-map",
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile:
            argv.mode === "production" ? "tsconfig.json" : "tsconfig.dev.json",
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: [/^react.*$/],
});
