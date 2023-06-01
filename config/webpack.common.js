const path = require('path');

const webpack = require('webpack');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');

const paths = require('./paths');
const assetPath = require('./assetPath');

const currentYear = new Date().getFullYear();

module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset/inline'
      },
      {
        test: /\.gif$/,
        type: 'asset/inline'
      },
      {
        test: /\.ico$/,
        type: 'asset/inline'
      },
      {
        test: /\.(jpg|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        type: 'asset'
      },
    ],
  },
  resolve: {
    alias: {
      '@city-assets': assetPath.cityAssets,
      '@city-i18n': assetPath.cityi18n,
    },
    extensions: ['.js', '.json', '.scss'],
    modules: ['node_modules', 'app'],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb|fi|sv/),
    new MomentTimezoneDataPlugin({
      startYear: currentYear - 2,
      endYear: currentYear + 10,
      matchZones: JSON.stringify(process.env.APP_TIMEZONE)
    }),
  ],
};
