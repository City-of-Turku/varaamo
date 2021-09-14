const path = require('path');

let cityConfig;
let cityAssets;
let cityImages;
let cityi18n;

if (process.env.THEME_PKG) {
  cityConfig = path.resolve(__dirname, `../node_modules/${process.env.THEME_PKG}/`);
  cityAssets = path.resolve(cityConfig, 'assets/');
  cityImages = path.resolve(cityAssets, 'images/');
  cityi18n = path.resolve(cityAssets, 'i18n/');
} else {
  cityAssets = path.resolve(__dirname, '../app/assets/whitelabel/');
  cityImages = path.resolve(cityAssets, 'images/');
  cityi18n = path.resolve(cityAssets, 'i18n/');
}

module.exports = { cityAssets, cityImages, cityi18n };
