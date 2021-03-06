const path = require("path");
module.exports = {
  mode: "development",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    path: path.join(__dirname, "../dist/"),
    publicPath: "/public/",
  },
  module: {
    rules: [
      // {
      //   enforce: "pre",
      //   test: /.(js|jsx)$/,
      //   loader: "eslint-loader",
      //   exclude: [path.resolve(__dirname, "../node_modules")],
      // },
      // {
      //   test: /\.ejs$/,
      //   loader: "compile-ejs-loader",
      //   options: {
      //     htmlmin: true,
      //     htmlminOptions: {
      //       removeComments: true,
      //     },
      //   },
      // },
    ],
  },
  // close performace warnings
  performance: {
    hints: false,
  },
  // 代码优化以及分包 快速加载
};
