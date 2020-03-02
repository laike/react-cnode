const path = require("path");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
// const webpack = require('webpack')
module.exports = webpackMerge(baseConfig, {
  mode: "development",
  target: "node",
  entry: path.join(__dirname, "../client/server-entry.js"),
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
  externals: [nodeExternals()],
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "../dev/"),
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: "babel-loader",
        exclude: [path.resolve(__dirname, "../node_modules")],
        options: {
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-transform-runtime"],
        },
      },
      {
        test: /\.css$/,
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].min.css",
      allChunks: false,
    }),
    new webpack.DefinePlugin({
      "process.env.API_BASE": JSON.stringify("http://localhost:3333"),
    }),
  ],
});
