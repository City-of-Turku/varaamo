import constants from '../../constants/AppConstants';
import { buildAPIUrl, getHeadersCreator } from '../../utils/apiUtils';

/**
 * Makes a POST request to check whether given resource
 * has a quality tool link.
 * @param {object} resourceId id of target resource for link check
 * @returns {boolean} true when resource has quality tool link and false otherwise
 */
async function checkQualityToolsLink(resourceId) {
  const apiUrl = buildAPIUrl('qualitytool/check');
  const payload = { resource: resourceId };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: constants.REQUIRED_API_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return false;
  }
  const data = await response.json();
  if (data && data.has_qualitytool) {
    return data.has_qualitytool;
  }
  return false;
}

/**
 * Handles fetching feedback form input label texts etc.
 * @param {object} state Redux state
 * @returns {object} object containing form labels etc. or when an fetch error occurs
 * an object containing errorOccurred: true
 */
async function getFeedbackForm(state) {
  const apiUrl = buildAPIUrl('qualitytool/form');
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: getHeadersCreator()(state),
  });
  if (!response.ok) {
    return { errorOccurred: true };
  }
  const data = await response.json();
  return data;
}

/**
 * Handles sending the feedback form's data.
 * @param {string} reservationId id of the created reservation
 * @param {number} stars rating i.e. 1-5
 * @param {string} feedbackText textual feedback value
 * @param {object} state Redux state
 * @returns {object} response data object or object containing errorOccurred: true
 * when post fails
 */
async function postFeedback(reservationId, stars, feedbackText, state) {
  const apiUrl = buildAPIUrl('qualitytool/feedback');
  const payload = {
    reservation_id: reservationId,
    rating: stars,
    text: feedbackText || null,
  };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: getHeadersCreator()(state),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { errorOccurred: true };
  }
  const data = await response.json();
  return data;
}

/**
 * Returns correct form field's text in given language
 * @param {object} formData object containing all form field text data
 * @param {string} currentLanguage language code i.e. fi, en, sv
 * @param {string} field input field's name on the form
 * @param {string} targetText input field's target text name i.e. label or hint
 * @returns {string} form field text or empty string if currentLanguage or form data is missing
 */
function getFormFieldText(formData, currentLanguage, field, targetText) {
  if (currentLanguage && formData && formData[currentLanguage]) {
    return formData[currentLanguage][field][targetText];
  }
  return '';
}


export {
  checkQualityToolsLink,
  getFeedbackForm,
  postFeedback,
  getFormFieldText,
};
