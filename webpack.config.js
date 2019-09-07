const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: "source-map",
  entry: {
    application: path.resolve(__dirname, "app/javascript/packs/application.tsx")
  },
  output: {
    path: path.resolve(__dirname, "public/packs"),
    publicPath: isProd ? "/packs/" : "//localhost:8081/packs/",
    filename: isProd ? "[name]-[hash].js" : "[name].js"
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        options: {
          emitErrors: true,
          failOnHint: true,
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    publicPath: "/packs/",
    host: "localhost",
    port: 8081,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  plugins: [
    new WebpackAssetsManifest({
      publicPath: true,
      writeToDisk: true
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? "[name]-[hash].css" : "[name].css",
    }),
  ],
};
