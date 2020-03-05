const path = require('path');

let cityConfig;
let cityAssets;
let cityImages;
let cityi18n;
if (process.env.CITY_THEME) {
  cityConfig = path.resolve(__dirname, `../node_modules/${process.env.CITY_THEME}/`);
  cityAssets = path.resolve(cityConfig, `assets/`);
  cityImages = path.resolve(cityAssets,'images/');

  cityi18n = path.resolve(cityAssets,'i18n/');

} else {
  console.log('else');
  cityAssets = path.resolve(__dirname, '../app/assets/whitelabel/');
  cityImages = 'null';
  cityi18n = path.resolve(__dirname, '../app/assets/styles/customization/vantaa/');
  // cityAssets = path.resolve(__dirname,'../app/assets/styles/customization/');
}
//const cityImages = path.resolve(cityAssets,'images/');

module.exports = { cityAssets, cityImages, cityi18n };
