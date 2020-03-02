const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
// const nameAllModulesPlugin = require('name-all-modules-plugin')
// const cdnConfig = require('../app.config') // 这里暂时没有配置
const isDev = process.env.NODE_ENV === "development";
const config = webpackMerge(baseConfig, {
  entry: {
    config: path.join(__dirname, "../client/app.js"),
  },
  output: {
    filename: "[name].[hash].js",
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "../client/template.html"),
    }),
    new HTMLPlugin({
      template: "!!compile-ejs-loader!" + path.join(__dirname, "../client/server.template.ejs"),
      filename: "server.ejs",
    }),
    new ExtractTextPlugin({
      filename: "[name].min.css",
      allChunks: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: "babel-loader",
        exclude: [path.resolve(__dirname, "../node_modules")],
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            "@babel/plugin-transform-runtime",
            [
              "babel-plugin-transform-imports",
              {
                "@material-ui/core": {
                  // Use "transform: '@material-ui/core/${member}'," if your bundler does not support ES modules
                  transform: "@material-ui/core/esm/${member}",
                  preventFullImport: true,
                },
                "@material-ui/icons": {
                  // Use "transform: '@material-ui/icons/${member}'," if your bundler does not support ES modules
                  transform: "@material-ui/icons/esm/${member}",
                  preventFullImport: true,
                },
              },
            ],
          ],
        },
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: "style-loader",
          },
          use: [
            {
              loader: "css-loader",
            },
          ],
          publicPath: "../",
        }),
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: "fonts/",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]",
        },
      },
    ],
  },
});

if (isDev) {
  // 如果是开发环境中
  // config.devtool = '#cheap-module-eval-source-map'
  // config.entry = {
  //   config: [
  //     'react-hot-loader/patch',
  //     path.join(__dirname, '../client/app.JS')
  //   ]
  // }
  config.devServer = {
    contentBase: path.join(__dirname, "../dist"),
    compress: true, // 是否压缩
    host: "0.0.0.0",
    port: 8888,
    publicPath: "/public/",
    hot: true,
    hotOnly: true,
    overlay: {
      errors: true,
    },
    historyApiFallback: {
      index: "/public/index.html",
    },
    proxy: {
      "/api": "http://localhost:3333",
    },
  };
  // add hot plugin
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  config.entry = {
    config: path.join(__dirname, "../client/app.js"),
    vendor: [
      "react",
      "react-dom",
      "react-router-dom",
      "mobx",
      "mobx-react",
      "axios",
      "query-string",
      // "highlight.js",
      // "markdown-it",
      // "marked",
      // "react-router",
      // "serialize-javascript",
      // "stats.js",
      // "typeface-roboto",
      // "url-parse",
    ],
  };
  config.output.filename = "[name].[chunkhash].js";
  config.optimization = {
    minimize: true,
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  };
  config.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join("_");
    }),
    // defined api base
    new webpack.DefinePlugin({
      "process.env.API_BASE": '"http://127.0.0.1:3333"',
    }),
  );
}

module.exports = config;
