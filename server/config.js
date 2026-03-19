import path from 'path';

import hashFile from 'hash-file';

const isProduction = process.env.NODE_ENV === 'production';

const defaultPort = isProduction ? 8080 : 3000;
const port = process.env.PORT || defaultPort;
// max age can be given in many units like seconds(s), minutes(m), hours(h) and days(d)
const httpCacheMaxAge = process.env.HTTP_CACHE_MAX_AGE || '30d';

function getAssetHash(filePath) {
  if (!isProduction) return '';
  try {
    return hashFile.sync(filePath);
  } catch (error) {
    return '';
  }
}

// Injected into HTML as window.__SETTINGS__. Read from process.env at call time so Azure
// App Service app settings (injected as env vars at runtime) are always used.
function getClientSettings() {
  return {
    ADMIN_URL: process.env.ADMIN_URL || '',
    API_URL: process.env.API_URL || '',
    OPENID_AUTHORITY: process.env.OPENID_AUTHORITY || '',
    OPENID_AUDIENCE: process.env.OPENID_AUDIENCE || 'https://auth.turku.fi/respa',
    CLIENT_ID: process.env.CLIENT_ID || '',
    SHOW_TEST_SITE_MESSAGE: Boolean(process.env.SHOW_TEST_SITE_MESSAGE === '1' || process.env.SHOW_TEST_SITE_MESSAGE === 'true'),
    BLOCK_SEARCH_ENGINE_INDEXING: Boolean(process.env.BLOCK_SEARCH_ENGINE_INDEXING === '1' || process.env.BLOCK_SEARCH_ENGINE_INDEXING === 'true'),
    TRACKING: Boolean(process.env.MATOMO_SITE_ID),
    TRACKING_ID: process.env.MATOMO_SITE_ID || '3',
    CUSTOM_MUNICIPALITY_OPTIONS: process.env.CUSTOM_MUNICIPALITY_OPTIONS || '',
    OG_IMG_URL: process.env.OG_IMG_URL || '',
    COOKIE_POLICY_BASE_URL: process.env.COOKIE_POLICY_BASE_URL || '',
    APP_TIMEZONE: process.env.APP_TIMEZONE || 'Europe/Helsinki',
  };
}

module.exports = {
  getClientSettings,
  assetsSources: {
    appCss: (
      isProduction
        ? `/_assets/app.css?${getAssetHash(path.resolve(__dirname, '../dist/app.css'))}`
        : ''
    ),
    appJs: (
      isProduction
        ? `/_assets/app.js?${getAssetHash(path.resolve(__dirname, '../dist/app.js'))}`
        : '/app.js'
    ),
  },
  isProduction,
  matomoSiteId: process.env.MATOMO_SITE_ID,
  port,
  webpackStylesExtensions: ['css', 'scss'],
  httpCacheMaxAge,
};
