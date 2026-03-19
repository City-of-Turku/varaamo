const path = require('path');

// Intentionally not loading .env here: one build is used for both test and prod. Runtime
// settings come from Azure (injected as window.__SETTINGS__ by the Node server). The
// fallback below is only used when __SETTINGS__ is absent (e.g. static HTML).

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
    // SETTINGS: use server-injected window.__SETTINGS__ at runtime
    // fallback must be an object so SETTINGS.API_URL is always a string
    (() => {
      const fallback = {
        ADMIN_URL: process.env.ADMIN_URL || 'https://respa.turku.fi/ra',
        API_URL: process.env.API_URL || 'https://respa.turku.fi/v1',
        SHOW_TEST_SITE_MESSAGE: Boolean(process.env.SHOW_TEST_SITE_MESSAGE),
        TRACKING: Boolean(process.env.MATOMO_SITE_ID),
        TRACKING_ID: process.env.MATOMO_SITE_ID || '3',
        CUSTOM_MUNICIPALITY_OPTIONS: process.env.CUSTOM_MUNICIPALITY_OPTIONS || '',
        CLIENT_ID: process.env.CLIENT_ID || '7f80c6cd-d10c-4345-850b-c86aec3a0e98',
        OPENID_AUDIENCE: process.env.OPENID_AUDIENCE || 'https://auth.turku.fi/respa',
        OPENID_AUTHORITY: process.env.OPENID_AUTHORITY || 'https://tunnistamo.turku.fi/openid',
        OG_IMG_URL: process.env.OG_IMG_URL || 'https://varaamo.turku.fi/static/images/aurajoki.jpg',
        COOKIE_POLICY_BASE_URL: process.env.COOKIE_POLICY_BASE_URL || 'https://varaamo.turku.fi/cookie-policy/',
        BLOCK_SEARCH_ENGINE_INDEXING: Boolean(process.env.BLOCK_SEARCH_ENGINE_INDEXING),
        APP_TIMEZONE: process.env.APP_TIMEZONE || 'Europe/Helsinki',
      };
      const fallbackLiteral = `{${Object.entries(fallback).map(([k, v]) => `${k}:${typeof v === 'string' ? JSON.stringify(v) : v}`).join(',')}}`;
      return new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        SETTINGS: `(typeof window !== "undefined" && window.__SETTINGS__) || (${fallbackLiteral})`,
      });
    })(),
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
