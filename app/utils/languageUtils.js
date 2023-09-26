import get from 'lodash/get';
import values from 'lodash/values';

import constants from 'constants/AppConstants';


/**
   * Returns correct feedback link based on given current language.
   *
   * @param {string} currentLanguage language code e.g. fi, sv, en
   * @returns {string} feedback link with correct language.
   * If given language code doesn't exist, returns Finnish link.
   */
function getFeedbackLink(currentLanguage) {
  switch (currentLanguage) {
    case 'sv':
      return constants.FEEDBACK_URL.SV;
    case 'fi':
      return constants.FEEDBACK_URL.FI;
    case 'en':
      return constants.FEEDBACK_URL.EN;
    default:
      return constants.FEEDBACK_URL.FI;
  }
}

/**
 * Returns a localized value for given field.
 * @param {object} field with translations e.g. name: {fi: ..., en: ..., sv: ...}
 * @param {string} locale fi, en or sv
 * @param {boolean} fallback try to find any other translation if given locale doesn't have a value.
 * Default is false.
 * @returns {string|null} localized value or null
 */
function getLocalizedFieldValue(field, locale, fallback = false) {
  const localeValue = get(field, locale, null);

  if (localeValue || !fallback) {
    return localeValue;
  }

  return values(field).find(fallbackValue => !!fallbackValue);
}

export { getFeedbackLink, getLocalizedFieldValue };
