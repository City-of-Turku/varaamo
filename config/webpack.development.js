const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const ESLintPlugin = require('eslint-webpack-plugin');

const common = require('./webpack.common');

const eslintOptions = {
  // extensions: ['js', 'jsx'],
  // exclude: ['node_modules', ],
  // files: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../src')],
  overrideConfigFile: path.resolve(__dirname, '../.eslintrc'),
  eslintPath: require.resolve('eslint'),
};
module.exports = merge(common, {
  mode: 'development',
  entry: [
    '@babel/polyfill',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, '../src/index.js'),
  ],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../src')],
        exclude: path.resolve(__dirname, '../node_modules'),
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer()] } } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer()] } } },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      SETTINGS: {
        ADMIN_URL: JSON.stringify(process.env.ADMIN_URL || 'https://testivaraamo.turku.fi:8010/ra'),
        API_URL: JSON.stringify(process.env.API_URL || 'https://testivaraamo.turku.fi:8010/v1'),
        SHOW_TEST_SITE_MESSAGE: Boolean(process.env.SHOW_TEST_SITE_MESSAGE),
        TRACKING: Boolean(process.env.MATOMO_SITE_ID),
        TRACKING_ID: JSON.stringify(process.env.MATOMO_SITE_ID),
        CUSTOM_MUNICIPALITY_OPTIONS: process.env.CUSTOM_MUNICIPALITY_OPTIONS,
        CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
        OPENID_AUDIENCE: JSON.stringify(process.env.OPENID_AUDIENCE),
        OPENID_AUTHORITY: JSON.stringify(process.env.OPENID_AUTHORITY),
        OG_IMG_URL: JSON.stringify(process.env.OG_IMG_URL || 'https://testivaraamo.turku.fi/static/images/aurajoki.jpg'),
        COOKIE_POLICY_BASE_URL: JSON.stringify(process.env.COOKIE_POLICY_BASE_URL || 'https://testivaraamo.turku.fi/cookie-policy/'),
        THEME_PKG: JSON.stringify(process.env.THEME_PKG),
        BLOCK_SEARCH_ENGINE_INDEXING: Boolean(process.env.BLOCK_SEARCH_ENGINE_INDEXING),
        APP_TIMEZONE: JSON.stringify(process.env.APP_TIMEZONE),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ESLintPlugin(eslintOptions)
  ],
});
