import getAboutContentEn from './aboutEn';
import getAboutContentFi from './aboutFi';
import getAboutContentSv from './aboutSv';

/**
 * Returns the content for the about page based on the current language.
 * @param {string} currentLanguage - 'en', 'fi' or 'sv'
 * @param {string} feedbackLink - url to feedback form
 * @returns {string} - html string content for the about page
 */
export function getAboutContent(currentLanguage, feedbackLink) {
  if (currentLanguage === 'en') {
    return getAboutContentEn(feedbackLink);
  }
  if (currentLanguage === 'sv') {
    return getAboutContentSv(feedbackLink);
  }
  return getAboutContentFi(feedbackLink);
}
