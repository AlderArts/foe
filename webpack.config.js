const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CopyWebpackPlugin = require("copy-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require(`webpack`);

module.exports = {
  mode: "development",
  entry: './index.ts',
  output: {
    filename: 'foe.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version),
      VERSION_NAME: JSON.stringify(require("./package.json").description)
    }),
    // Opt-in bundle analysis: ANALYZE=1 npm run build
    ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : []),
    new CopyWebpackPlugin({
      patterns: [
        { from: './foe.html' },
        { from: './changelog' },
        { from: 'assets/css', to: 'assets/css' },
        { from: 'assets/fonts', to: 'assets/fonts' }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new ZipPlugin({
      filename: 'FoE-latest.zip',
    }),

    new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: { target: 'es2022' },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
        type: 'asset/resource',
        generator: { filename: 'assets/img/[name][ext]' }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: { filename: 'assets/fonts/[name][ext]' }
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({}),
      new CssMinimizerPlugin({})
    ]
  },
  devServer: {
    static: { directory: path.join(__dirname) },
    port: 8080
  }
};
