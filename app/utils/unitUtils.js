
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
      return `https://servicekarta.turku.fi/unit/${unit.mapServiceId}#!route-details`;
    case 'fi':
      return `https://palvelukartta.turku.fi/unit/${unit.mapServiceId}#!route-details`;
    case 'en':
      return `https://servicemap.turku.fi/unit/${unit.mapServiceId}#!route-details`;
    default:
      return `https://palvelukartta.turku.fi/unit/${unit.mapServiceId}#!route-details`;
  }
}

export {
  getServiceMapUrl,
};
