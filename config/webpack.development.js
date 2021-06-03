const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const common = require('./webpack.common');

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
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../src')],
        loader: 'eslint-loader',
        options: {
          configFile: path.resolve(__dirname, '../.eslintrc'),
          eslintPath: require.resolve('eslint'),
        },
      },
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
          { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 2 version', 'ie 9'] })] } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true, sourceMapContents: false } },
          { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 2 version', 'ie 9'] })] } },
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
        TRACKING: Boolean(process.env.PIWIK_SITE_ID),
        TRACKING_ID: JSON.stringify(process.env.PIWIK_SITE_ID),
        CUSTOM_MUNICIPALITY_OPTIONS: process.env.CUSTOM_MUNICIPALITY_OPTIONS,
        CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
        OPENID_AUDIENCE: JSON.stringify(process.env.OPENID_AUDIENCE),
        OPENID_AUTHORITY: JSON.stringify(process.env.OPENID_AUTHORITY),
        OG_IMG_URL: JSON.stringify(process.env.OG_IMG_URL || 'https://testivaraamo.turku.fi/static/images/aurajoki.jpg'),
        COOKIE_POLICY_BASE_URL: JSON.stringify(process.env.COOKIE_POLICY_BASE_URL || 'https://testivaraamo.turku.fi/cookie-policy/'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
