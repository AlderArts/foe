const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TSLintPlugin = require('tslint-webpack-plugin');

const CopyWebpackPlugin = require("copy-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');

const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  mode: "development",
  entry: './index.ts',
  plugins: [
    new TSLintPlugin({
      files: ['./**/*.ts']
    }),
    new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin([
        './foe.html',
        './changelog',
        {from:'assets/css',to:'assets/css'},
        {from:'assets/fonts',to:'assets/fonts'}
    ]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CleanWebpackPlugin(),
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
        use: 'ts-loader',
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
        use: [
          'file-loader?name=assets/img/[name].[ext]'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=assets/fonts/[name].[ext]'
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  output: {
    filename: 'foe.js',
    path: path.resolve(__dirname, 'dist')
  }
};
