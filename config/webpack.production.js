const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');

const common = require('./webpack.common');

module.exports = merge(common, {
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/index.js')],
  devtool: 'source-map',
  cache: true,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/_assets/',
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /^(?!.*\.spec\.js$).*\.js$/,
        include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../src')],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer()] } } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer()] } } },
        ],
      },
    ],
  },
  plugins: [
    // Important to keep React file size down
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      SETTINGS: {
        ADMIN_URL: JSON.stringify(process.env.ADMIN_URL || 'https://respa.turku.fi/ra'),
        API_URL: JSON.stringify(process.env.API_URL || 'https://respa.turku.fi/v1'),
        SHOW_TEST_SITE_MESSAGE: Boolean(process.env.SHOW_TEST_SITE_MESSAGE),
        TRACKING: Boolean(process.env.MATOMO_SITE_ID),
        TRACKING_ID: JSON.stringify(process.env.MATOMO_SITE_ID),
        CUSTOM_MUNICIPALITY_OPTIONS: process.env.CUSTOM_MUNICIPALITY_OPTIONS,
        CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
        OPENID_AUDIENCE: JSON.stringify(process.env.OPENID_AUDIENCE),
        OPENID_AUTHORITY: JSON.stringify(process.env.OPENID_AUTHORITY),
        OG_IMG_URL: JSON.stringify(process.env.OG_IMG_URL || 'https://varaamo.turku.fi/static/images/aurajoki.jpg'),
        COOKIE_POLICY_BASE_URL: JSON.stringify(process.env.COOKIE_POLICY_BASE_URL || 'https://varaamo.turku.fi/cookie-policy/'),
        BLOCK_SEARCH_ENGINE_INDEXING: Boolean(process.env.BLOCK_SEARCH_ENGINE_INDEXING),
        APP_TIMEZONE: JSON.stringify(process.env.APP_TIMEZONE),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  },
});
