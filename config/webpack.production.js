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
    // SETTINGS: use server-injected window.__SETTINGS__ at runtime; fallback when absent (e.g. static HTML).
    // Boolean coercion must match server: only '1' or 'true' are truthy (string "false" must stay falsy).
    (() => {
      const env = process.env;
      const truthy = (v) => v === true || v === '1' || v === 'true';
      const trackingOn = (v) => !!(v && v !== '0' && v !== 'false');
      const fallback = {
        ADMIN_URL: env.ADMIN_URL || 'https://respa.turku.fi/ra',
        API_URL: env.API_URL || 'https://respa.turku.fi/v1',
        SHOW_TEST_SITE_MESSAGE: truthy(env.SHOW_TEST_SITE_MESSAGE),
        TRACKING: trackingOn(env.MATOMO_SITE_ID),
        TRACKING_ID: env.MATOMO_SITE_ID || '3',
        CUSTOM_MUNICIPALITY_OPTIONS: env.CUSTOM_MUNICIPALITY_OPTIONS || '',
        CLIENT_ID: env.CLIENT_ID || '7f80c6cd-d10c-4345-850b-c86aec3a0e98',
        OPENID_AUDIENCE: env.OPENID_AUDIENCE || 'https://auth.turku.fi/respa',
        OPENID_AUTHORITY: env.OPENID_AUTHORITY || 'https://tunnistamo.turku.fi/openid',
        OG_IMG_URL: env.OG_IMG_URL || 'https://varaamo.turku.fi/static/images/aurajoki.jpg',
        COOKIE_POLICY_BASE_URL: env.COOKIE_POLICY_BASE_URL || 'https://varaamo.turku.fi/cookie-policy/',
        BLOCK_SEARCH_ENGINE_INDEXING: truthy(env.BLOCK_SEARCH_ENGINE_INDEXING),
        APP_TIMEZONE: env.APP_TIMEZONE || 'Europe/Helsinki',
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
