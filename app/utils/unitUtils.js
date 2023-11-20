
/**
 * Returns correct service map url for given unit based on given language code.
 * @param {object} unit which contains mapServiceId for service map url building.
 * @param {string} currentLanguage language code e.g. fi, sv, en.
 *
 * @returns {string} service map url for correct language.
 * If given language code doesn't exist, returns Finnish url.
 */
function getServiceMapUrl(unit, currentLanguage) {
  if (!unit || !unit.mapServiceId) {
    return '';
  }

  switch (currentLanguage) {
    case 'sv':
      return `https://palvelukartta.turku.fi/sv/unit/${unit.mapServiceId}`;
    case 'fi':
      return `https://palvelukartta.turku.fi/fi/unit/${unit.mapServiceId}`;
    case 'en':
      return `https://palvelukartta.turku.fi/en/unit/${unit.mapServiceId}`;
    default:
      return `https://palvelukartta.turku.fi/unit/${unit.mapServiceId}`;
  }
}

export {
  getServiceMapUrl,
};
