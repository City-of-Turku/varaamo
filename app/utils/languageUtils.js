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

export { getFeedbackLink };
